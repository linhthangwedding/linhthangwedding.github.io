/** Read-only check. Run from the editor; it does not need deployment. */
function checkPhotoHearts() {
  var properties = PropertiesService.getScriptProperties().getProperties();
  console.log("Photo-heart storage read: OK");
  console.log("Photo-heart IDs: " + JSON.stringify(PHOTO_HEART_IDS_));
  console.log(JSON.stringify(photoHeartSnapshot_(properties, "")));
}
