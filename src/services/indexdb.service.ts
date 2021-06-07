import { uploadDirectS3 } from "./upload.service";
const DB_VERSION = 1;
const DB_NAME = "pwa-upload";
export const UPLOAD_STORE_NAME = "uploads";
export const UPLOAD_SYNC_NAME = "upload-sync";

export const openDB = (storeName: string) => {
  console.log("index db open");
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject("IndexedDB not supported");
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event: any) => {
      console.log("object store failed to create", event.target.error);
      reject("DB error: " + event.target.error);
    };

    //when the database is opened with a higher version
    request.onupgradeneeded = (event: any) => {
      const db = event?.target?.result;
      const upgradeTransaction = event.target.transaction;
      if (!db.objectStoreNames.contains(storeName)) {
        //create object store
        db.createObjectStore(storeName, { keyPath: "id" });
      } else {
        upgradeTransaction.objectStore(storeName);
      }
    };

    request.onsuccess = (event: any) => {
      console.log("object store created");
      resolve(event.target.result);
    };
  });
};

export const openObjectStore = (
  db: any,
  name: string,
  transactionMode: any
) => {
  return db.transaction(name, transactionMode).objectStore(name);
};

export const addObject = (storeName: string, dataObject: any) => {
  return new Promise((resolve, reject) => {
    console.log("addObject", dataObject);
    openDB(storeName)
      .then((db) => {
        openObjectStore(db, storeName, "readwrite").add(
          dataObject
        ).onsuccess = resolve;
      })
      .catch((reason) => reject(reason));
  });
};

// delete data from indexedb, that sent to server
export function deleteFromIndexdb(storeName: string, index: number) {
  return new Promise((resolve, reject) => {
    openDB(storeName)
      .then((db) => {
        openObjectStore(db, storeName, "readwrite").delete(
          index
        ).onsuccess = resolve;
      })
      .catch((reason) => reject(reason));
  });
}

export const uploadFile = (
  file: any,
  onProgress: (progress: number) => void,
  onComplete: (err: any) => void
) => {
  const postData = {
    id: +Date.now().toString().substring(3, 11),
    file,
  };
  addObject(UPLOAD_STORE_NAME, postData).catch((e) => console.error(e));

  if (
    "serviceWorker" in navigator &&
    "SyncManager" in window &&
    !navigator.onLine
  ) {
    console.log("serviceworker supported");
    navigator.serviceWorker.ready.then(function (registration) {
      registration.sync.register(UPLOAD_SYNC_NAME);
    });
  } else {
    console.log("no serviceworker upload directly");
    uploadDirectS3(file, onProgress, onComplete);
  }
};
// get data from indexedb and send to server
const getFiles = () => {
  console.log("getFiles");
  return new Promise((resolve, reject) => {
    openDB(UPLOAD_STORE_NAME)
      .then((db) => {
        const files: any[] = [];
        console.log("getFiles opendb");
        const store = openObjectStore(db, UPLOAD_STORE_NAME, "readwrite");
        const openCursor = store.openCursor();
        openCursor.openCursor().onsuccess = (event: any) => {
          const cursor = event.target.result;
          if (cursor) {
            console.log("upload unsent cursor exist", cursor.value);
            files.push(cursor.value);
            cursor.continue();
          } else {
            resolve(files);
          }
        };
      })
      .catch(function (e) {
        console.error("Error to open db on unsent", e);
        reject(e);
      });
  });
};

export const syncFiles = () => {
  return getFiles().then((files) => {
    return Promise.all(
      // @ts-ignore
      files.map((file) => {
        return uploadDirectS3(
          file.file,
          () => {},
          () => {
            console.log("sync oncomplete upload");
            deleteFromIndexdb(UPLOAD_STORE_NAME, file.id);
          }
        );
      })
    );
  });
};
