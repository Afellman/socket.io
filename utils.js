function roomCheck(roomArray, newRoom) {
  var roomCheck = roomArray.filter(el=> {return el.roomName == newRoom})
  if (roomCheck.length > 0) {
    return false
  } else {
    return true
  }

}


function joinGame(roomArray, roomName, userName) {
  var roomIndex = roomArray.findIndex(function(el) {
    return el.roomName == roomName
  })
  if(roomIndex !== -1 && !roomArray[roomIndex].full){
    roomArray[roomIndex].client = userName;
    roomArray[roomIndex].full = true;
    return true
  } else {
    return false;
  }
}


function deleteRoom(roomArray, roomName) {
  var roomIndex = roomArray.findIndex(function(el) {
    return el.roomName == roomName
  })
  roomArray.splice(roomIndex, 1);
}



module.exports = {
  roomCheck: roomCheck,
  joinGame : joinGame,
  deleteRoom: deleteRoom
}