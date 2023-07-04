/*

    1. Open our Database.
    2. Initialize DB

    3. Create Object Store
*/

let db;

let openRequest = indexedDB.open("myProject");

openRequest.addEventListener("success", function () {
  console.log("DB Success");
  db = openRequest.result;
});

openRequest.addEventListener("upgradeneeded", function () {
  console.log("DB upgradeneeded");
  db = openRequest.result;

  db.createObjectStore("video", { keyPath: "id" });
});

openRequest.addEventListener("error", function () {
  console.log("DB Error");
});
