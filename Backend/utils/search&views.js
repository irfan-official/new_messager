class SearchAndViews {
  constructor(index, type, entity, room) {
    // entity = GroupOrUser
    this.index = Number(index);
    this.type = type;
    if (type === "User") {
      this.user = entity;
    } else if (type === "Group") {
      this.group = entity;
    }
    this.room = room;
  }
}
export default SearchAndViews;
