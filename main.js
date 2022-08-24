const fs = require("fs");

let hotel = []
let availableRoom = []
let notAvailableRoom = []
function createRoom(inputFloor,inputNumber) {
  for( let i = 1 ; i <= inputFloor;i++){
    for( let j = 1 ; j <= inputNumber;j++){
      let jString = j.toString()
      if(jString.length == 1){
        jString = jString.padStart(2,"0")
      }
      hotel.push([i]+[jString])
      availableRoom.push([i]+[jString])
    }
  }
}

function checkin(inputHotel){
  let booked
  if(inputHotel) {
    booked = availableRoom[availableRoom.indexOf(inputHotel)]
    availableRoom.splice(availableRoom.indexOf(inputHotel),1)
    notAvailableRoom.push(booked);
    return
  }
  booked = availableRoom.shift();
  notAvailableRoom.push(booked);
}
checkin(hotel)

function menu (input,param){
  switch(input){
      //สร้างโรงแรมโดยกำหนดจำนวนชั้นและจำนวนห้องต่อชั้นได้
    case "create_hotel" :
      createRoom(inputFloor = param[0],  inputNumber = param[1])
      break;
    case "book" :
      break;
    case "list-available_rooms" :
      break;
    case "checkout" :
      break;
    case "list_guest" :
      break;
    case "get_guest_in_room" :
      break;
    case "list_guest_by_age" :
      break;
    case "checkout_guest_by_floor" :
      break;
    case "book_by_floor" :
      break;


    default :
      break;
  }
}


class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}


function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);

  commands.forEach((command) => {
    console.log(command)
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
        for (let key of commands){
          menu(Object.values(key)[0] ,Object.values(key)[1])

        }
        return;
      default:
        return;
    }
  });
}


function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);
            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );

}

main();
console.log(hotel)
console.log(availableRoom)

