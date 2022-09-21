import { openDatabase } from 'expo-sqlite';
// enablePromise(true);

export const TABLE_SETTING = 'TABLE_SETTING';
export const TABLE_CHAPTERS = 'TABLE_CHAPTERS';
export const TABLE_CHAPTERS_OFFLINE = 'TABLE_CHAPTERS_OFFLINE';
export const TABLE_STORIES_OFFLINE = 'TABLE_STORIES_OFFLINE';
export const TABLE_NOTIFICATION = 'TABLE_NOTIFICATION';
let DB = openDatabase('app.db');

//khởi tạo db
export const createDB = async defaultSettings => {
  return new Promise((resolve, reject) => {
    DB.transaction(
      function (tx) {
        // bảng cài đặt người dùng
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' + TABLE_SETTING + ' (key, value)',
        );

        //bảng lưu chương mới đọc
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_CHAPTERS +
            ' (id, name, number, storiesId, time)',
        );

        //bảng truyện đã tải
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_STORIES_OFFLINE +
            ' (id, name, images, listSaved)',
        );

        //bảng các chương truyện đã tải
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_CHAPTERS_OFFLINE +
            ' (id, name, storiesId, nextChapter, previousChapter, storySectionsId, storySectionsName, number, content)',
        );

        //thiết lập cài đặt ban đầu
        if (defaultSettings) {
          const arrSettings = Object.keys(defaultSettings).map(key => ({
            key,
            value: defaultSettings[key],
          }));
          arrSettings.map(item => {
            tx.executeSql('INSERT INTO ' + TABLE_SETTING + ' VALUES (?,?)', [
              item.key,
              item.value,
            ]);
          });
        }
      },
      function (error) {
        reject();
        console.log('Populated database ERROR: ' + error.message);
      },
      function () {
        resolve();
        console.log('Populated database OK');
      },
    );
  });
};

// thêm truyện vào db
export const insertStoryOffline = async (chapters, idSaved, story) => {
  const info = await getInfoStory(story.id);

  if (info?.id) {
    // console.log({ info });
    let newListSaved = [...info.listSaved, idSaved];

    const checked = info.listSaved.includes(idSaved);
    if (checked) {
      newListSaved = [...info.listSaved];
    }

    DB.transaction(
      function (tx) {
        //cập nhật lại danh sách chương đã tải
        tx.executeSql(
          `UPDATE ${TABLE_STORIES_OFFLINE} SET  listSaved = ? WHERE id = ?`,
          [newListSaved.join(','), story.id],
        );

        //thêm các chương vừa tải về vào db
        chapters.map(item => {
          // xóa item đã tồn tại
          tx.executeSql(`DELETE FROM ${TABLE_CHAPTERS_OFFLINE} WHERE id = ?`, [
            item.id,
          ]);

          // thêm mới item
          tx.executeSql(
            `INSERT INTO ${TABLE_CHAPTERS_OFFLINE} (id, name, storiesId, nextChapter, previousChapter, storySectionsId, storySectionsName, number, content) VALUES (?,?,?,?,?,?,?,?,?)`,
            [
              item.id,
              item.name,
              item.storiesId,
              JSON.stringify(item.nextChapter),
              JSON.stringify(item.previousChapter),
              item.storySections?.id,
              item.storySections?.name,
              item.number,
              item.content,
            ],
          );
        });
      },
      function (error) {
        console.log('Update STORIES_OFFLINE ERROR: ' + error.message);
      },
      function () {
        console.log('Update STORIES_OFFLINE OK');
      },
    );
  } else {
    const newListSaved = [idSaved];

    // thêm mới truyện nếu chưa có trong db
    DB.transaction(
      function (tx) {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_STORIES_OFFLINE +
            ' (id, name, images, listSaved)',
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_CHAPTERS_OFFLINE +
            ' (id, name, storiesId, nextChapter, previousChapter, storySectionsId, storySectionsName, number, content)',
        );
        tx.executeSql(
          `INSERT INTO ${TABLE_STORIES_OFFLINE} (id, name, images, listSaved) VALUES (?,?,?,?)`,
          [
            story.id,
            story.name,
            JSON.stringify(story.images),
            newListSaved.join(','),
          ],
        );

        chapters.map(item => {
          tx.executeSql(
            `INSERT INTO ${TABLE_CHAPTERS_OFFLINE} (id, name, storiesId, nextChapter, previousChapter,storySectionsId, storySectionsName, number, content) VALUES (?,?,?,?,?,?,?,?,?)`,
            [
              item.id,
              item.name,
              item.storiesId,
              JSON.stringify(item.nextChapter),
              JSON.stringify(item.previousChapter),
              item.storySections?.id,
              item.storySections?.name,
              item.number,
              item.content,
            ],
          );
        });
      },
      function (error) {
        console.log('Insert STORIES_OFFLINE ERROR: ' + error.message);
      },
      function () {
        console.log('Insert STORIES_OFFLINE OK');
      },
    );
  }
};

//lấy danh sách các truyện đã tải

export const getAllStoriesOffline = async () => {
  const getList = results => {
    let items = [];
    for (let i = 0; i < results.rows.length; i++) {
      let row = results.rows.item(i);
      const item = {
        id: row.id,
        name: row.name,
        images: JSON.parse(row.images),
      };
      // console.log('row', row);
      items.push(item);
    }
    return items;
  };
  return await new Promise((resolve, reject) => {
    try {
      DB.transaction(async tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_STORIES_OFFLINE +
            ' (id, name, images, listSaved)',
        );

        let sql = `SELECT * FROM ${TABLE_STORIES_OFFLINE}`;
        let dependencies = [];

        await tx.executeSql(sql, dependencies, (tx, results) => {
          let items = getList(results);
          resolve(items);
        });
      });
    } catch (err) {
      reject();
    }
  });
};

//lấy thông tin của 1 truyện
export const getInfoStory = async storiesId => {
  // console.log({ storiesId });
  const list = await getAllChaptersOffline(`${storiesId}`);
  return new Promise((resolve, reject) => {
    try {
      DB.transaction(tx => {
        // console.log('run');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_STORIES_OFFLINE +
            ' (id, name, images, listSaved)',
        );
        let sql = `SELECT * FROM ${TABLE_STORIES_OFFLINE} WHERE id = ?`;
        let dependencies = [`${storiesId}`];
        tx.executeSql(sql, dependencies, (tx, results) => {
          let items = [];
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows.item(i);
            const item = {
              id: row.id,
              name: row.name,
              countSaved: list?.length || 0,
              listSaved: row.listSaved.split(','),
              images: JSON.parse(row.images),
            };
            // console.log('row', row);
            items.push(item);
          }
          resolve(items[0]);
        });
      });
    } catch (err) {
      // console.log({ err });
      reject();
    }
  });
};

// lấy danh sách các chương đã tải
export const getAllChaptersOffline = async storiesId => {
  const getListChapter = results => {
    let items = [];
    for (let i = 0; i < results.rows.length; i++) {
      let row = results.rows.item(i);
      const item = {
        id: row.id,
        name: row.name,
        storiesId: row.storiesId,
        storySections: {
          id: row.storySectionsId,
          name: row.storySectionsName,
        },

        number: row.number,
        content: row.content,
      };
      // console.log('row', row);
      items.push(item);
    }
    return items;
  };
  return await new Promise((resolve, reject) => {
    try {
      DB.transaction(async tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_CHAPTERS_OFFLINE +
            ' (id, name, storiesId, nextChapter, previousChapter, storySectionsId, storySectionsName, number, content)',
        );

        let sql = `SELECT * FROM ${TABLE_CHAPTERS_OFFLINE}`;
        let dependencies = [];
        if (storiesId) {
          sql = `SELECT * FROM ${TABLE_CHAPTERS_OFFLINE} WHERE storiesId = ?`;
          dependencies = [storiesId];
        }
        await tx.executeSql(sql, dependencies, (tx, results) => {
          let items = getListChapter(results);
          resolve(items);
        });
      });
    } catch (err) {
      reject();
    }
  });
};

//lấy thông tin 1 chương
export const getInfoChapterOffline = async chaperId => {
  return new Promise((resolve, reject) => {
    try {
      DB.transaction(tx => {
        // console.log('run');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TABLE_CHAPTERS_OFFLINE +
            ' (id, name, storiesId, nextChapter, previousChapter, storySectionsId, storySectionsName, number, content)',
        );
        let sql = `SELECT * FROM ${TABLE_CHAPTERS_OFFLINE} WHERE id = ?`;
        let dependencies = [`${chaperId}`];
        tx.executeSql(sql, dependencies, (tx, results) => {
          let items = [];
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows.item(i);
            // console.log({ row });
            const item = {
              id: row.id,
              name: row.name,
              storiesId: row.storiesId,
              storySections: {
                id: row.storySectionsId,
                name: row.storySectionsName,
              },
              nextChapter: row.nextChapter
                ? JSON.parse(row.nextChapter || '')
                : null,
              previousChapter: row.previousChapter
                ? JSON.parse(row.previousChapter || '')
                : null,
              number: row.number,
              content: row.content,
            };
            // console.log('row', row);
            items.push(item);
          }
          resolve(items[0]);
        });
      });
    } catch (err) {
      // console.log({ err });
      reject();
    }
  });
};

//Setting
export const getAllSetting = async () => {
  return await new Promise((resolve, reject) => {
    DB.transaction(async tx => {
      tx.executeSql(`SELECT * FROM ${TABLE_SETTING}`, [], (_tx, results) => {
        let items = {};
        // console.log({ results });
        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          items = {
            ...items,
            [row.key]: row.value,
          };
        }
        resolve(items);
      });
    });
  });
};

// cập nhật setting
export const updateSetting = async ({ key, value }) => {
  DB.transaction(
    function (tx) {
      tx.executeSql(`UPDATE ${TABLE_SETTING} SET value = ? WHERE key = ?`, [
        value,
        key,
      ]);
    },
    function (error) {
      console.log('Update setting ERROR: ' + error.message);
    },
    function () {
      console.log('Update setting OK');
    },
  );
};

// lấy danh sách các chương đọc gần đây
export const getAllChaptersByStory = async (storiesId, orderBy) => {
  const getListChapter = results => {
    let items = [];
    for (let i = 0; i < results.rows.length; i++) {
      let row = results.rows.item(i);
      const item = {
        id: row.id,
        name: row.name,
        number: row.number,
        storiesId: row.storiesId,
        time: JSON.parse(row.time),
      };
      // console.log('row', row);
      items.push(item);
    }
    return items;
  };
  return await new Promise((resolve, reject) => {
    try {
      DB.transaction(async tx => {
        let sql = `SELECT * FROM ${TABLE_CHAPTERS}`;
        let dependencies = [];
        if (`${storiesId}`) {
          sql = `SELECT * FROM ${TABLE_CHAPTERS} WHERE storiesId = ?`;
          dependencies = [`${storiesId}`];
        }

        if (orderBy) {
          sql = `${sql} ORDER BY ${orderBy[0]} ${orderBy[1]}`;
        }
        await tx.executeSql(sql, dependencies, (tx, results) => {
          let items = getListChapter(results);
          resolve(items);
        });
      });
    } catch (err) {
      reject();
    }
  });
};

// thêm chương vừa đọc vào db
export const insertChapter = async chapterItem => {
  let listAll = (await getAllChaptersByStory(chapterItem.storiesId)) || [];
  const index = listAll.findIndex(item => item.id === chapterItem.id);

  if (index < 0) {
    if (listAll?.length >= 3) {
      const lastIndex = listAll.pop();
      await delChapters(lastIndex.id);
    }

    DB.transaction(
      function (tx) {
        tx.executeSql(
          `INSERT INTO ${TABLE_CHAPTERS} (id, name, number, storiesId, time) VALUES (?,?,?,?,?)`,
          [
            chapterItem.id,
            chapterItem.name,
            chapterItem.number,
            chapterItem.storiesId,
            JSON.stringify(new Date()),
          ],
        );
      },
      function (error) {
        console.log('Insert chapter ERROR: ' + error.message);
      },
      function () {
        console.log('Insert chapter OK');
      },
    );
  } else {
    updateChapter(chapterItem.id);
  }
};

// xóa chương trong db
export const delChapters = async id => {
  DB.transaction(
    function (tx) {
      tx.executeSql(`DELETE FROM ${TABLE_CHAPTERS} WHERE id = ?`, [id]);
    },
    function (error) {
      console.log('Delete ERROR: ' + error.message);
    },
    function () {
      console.log('Delete Chapter OK');
    },
  );
};

// cập nhật lại thời gian đọc chương
export const updateChapter = async key => {
  DB.transaction(
    function (tx) {
      tx.executeSql(`UPDATE ${TABLE_CHAPTERS} SET time = ? WHERE id = ?`, [
        JSON.stringify(new Date()),
        key,
      ]);
    },
    function (error) {
      console.log('Update Chapter ERROR: ' + error.message);
    },
    function () {
      console.log('Update Chapter OK');
    },
  );
};

// xóa 1 bảng
export const DropTable = async table_name => {
  DB.transaction(
    tx => {
      tx.executeSql(`DROP TABLE ${table_name}`);
    },
    error => {
      console.log('Delete Table ERROR: ' + error.message);
    },
    () => {
      console.log('Delete Table ok');
    },
  );
};
