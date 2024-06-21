type Room = {
  "roomPrice": number,
  "adultPrice": number,
  "childPrice": number,
  "capacity": number
};

export type GuestData = {
  "guest": {
    "adult": number,
    "child": number
  },
  "rooms": Room[]
};

// const guest = { adult: 4, child: 2 }
// const rooms = [
//   { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
//   { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
// ]
// const guest = { adult: 7, child: 3 }
// const rooms = [
//   { roomPrice: 2000, adultPrice: 200, childPrice: 100, capacity: 4 },
//   { roomPrice: 2000, adultPrice: 200, childPrice: 100, capacity: 4 },
//   { roomPrice: 2000, adultPrice: 400, childPrice: 200, capacity: 2 },
//   { roomPrice: 2000, adultPrice: 400, childPrice: 200, capacity: 2 },
// ]
const guest = { adult: 16, child: 0 }
const rooms = [
  { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
]

const fetchGuestData = () => {
  const data = { guest, rooms };
  return data;
};

export default fetchGuestData;