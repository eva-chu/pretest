'use client'

import { useState, useEffect } from "react";
import fetchGuestData, { GuestData } from "@/services/fetchGuestData";
import InputNumber from "@/components/InputNumber";
import ReactLoading from 'react-loading';

export default function Home() {
  const [ guest, setGuest] = useState<GuestData["guest"]>({
    adult: 0,
    child: 0
  });
  const [ rooms, setRooms] = useState<GuestData["rooms"]>([]);

  const getGuestData = () => {
    const { guest, rooms } = fetchGuestData();
    setGuest(guest);
    setRooms(rooms);
  };

  useEffect(() => {
    getGuestData();
  }, []);

  return (
    <main className="flex justify-center items-center h-screen">
      {guest.adult + guest.child + rooms.length > 0 ?
        <RoomAllocation
          guest={guest}
          rooms={rooms}
          onChange={result => console.log('result:', result)}
        /> :
        <ReactLoading type={'bubbles'} color={'rgb(103 232 249)'} height={'50px'} width={'100px'} />
      }
    </main>
  );
}

interface IProps {  
  guest: GuestData["guest"],
  rooms: GuestData["rooms"],
  onChange: (results: { adult: number, child: number, price: number }[]) => void
}

function RoomAllocation({ guest, rooms, onChange }: IProps) {
  const [ roomMap, setRoomMap ] = useState<{ adult: number, child: number, price: number }[]>([]);
  const [ currAdult, setCurrAdult ] = useState<number>(0);
  const [ currChild, setCurrChild ] = useState<number>(0);

  const getDefaultRoomAllocation = () => {
    const roomStatusList = rooms.map(room => ({
      ...room,
      adult: 0,
      child: 0,
      price: 0,
    }));
    let defaultRooms: {
      adult: number,
      child: number,
      price: number
    }[] = [];
    let minPrice = Infinity;
    const backtracking = (
      roomStatusList: {
        adult: number,
        child: number,
        price: number,
        roomPrice: number,  
        adultPrice: number, 
        childPrice: number,
        capacity: number
      }[], 
      adult: number,
      child: number,
      cache = new Map()
    ) => {
      const key = roomStatusList.map(roomStatus => (roomStatus.adult + ',' + roomStatus.child)).join(',');
      if (cache.has(key)) return;
      // finish allocation and calculate total price
      if (adult === 0 && child === 0) {
        let isValid = true;
        let totalPrice = 0;
        for (let room of roomStatusList) {
          if (room.child > 0 && room.adult === 0) {
            return isValid = false;
          }
          totalPrice += room.price;
        }
        if (isValid)  {
          const newRoomStatus = roomStatusList.map(room=>({
            adult: room.adult,
            child: room.child,
            price: room.price
          }));
          // console.log('totalPrice', totalPrice);
          // console.log('newRoomStatus', newRoomStatus);
          if (totalPrice < minPrice) {
            minPrice = totalPrice;
            defaultRooms = newRoomStatus;
          }
        }
        return;
      }
      for (let room of roomStatusList) {
        // allocate adults
        if (adult > 0 && room.capacity > 0) {
          let reset = false;
          room.adult++;
          if (room.price === 0) {
            room.price = room.roomPrice;
            reset = true;
          }
          room.price += room.adultPrice;
          room.capacity--;
          adult--;
          backtracking(roomStatusList, adult, child, cache);
          room.adult--;
          if (reset) {
            room.price -= room.roomPrice;
          }
          room.price -= room.adultPrice;
          room.capacity++;
          adult++;
        }
        // allocate children
        if (child > 0 && room.capacity > 0) {
          let reset = false;
          room.child++;
          if (room.price === 0) {
            room.price = room.roomPrice;
            reset = true;
          }
          room.price += room.childPrice;
          room.capacity--;
          child--;
          backtracking(roomStatusList, adult, child, cache);
          room.child--;
          if (reset) {
            room.price -= room.roomPrice;
          }
          room.price -= room.childPrice;
          room.capacity++;
          child++;
        }
      }
      cache.set(key, true);
    };
    backtracking(roomStatusList, guest.adult, guest.child);
    // console.log(defaultRooms);
    return defaultRooms;
  };

  const changeAdultInput = (e: any, index: number) => {
    console.log('change adult input');
    console.log('e.target.name: ', e.target.name);
    console.log('e.target.value: ', e.target.value);
    console.log('==================');
    const newRoom = roomMap.find((room, id) => id === index);
    if (newRoom) {
      const adultNum = Number(e.target.value);
      const adultPrice = rooms[index].adultPrice
      const prevPriceWithoutAdult = newRoom.price - (adultPrice * newRoom.adult);
      newRoom.adult = adultNum;
      newRoom.price = prevPriceWithoutAdult + (adultPrice * adultNum);
      const newRoomMap = roomMap.map((room, id) => index === id ? newRoom : room);
      const newAdult = newRoomMap.reduce((acc, curr)=>(acc + curr.adult), 0);
      setRoomMap(newRoomMap);
      setCurrAdult(newAdult);
      onChange(roomMap);
    }
  };

  const blurAdultInput = (e: any, index: number) => {
    console.log('blur adult input');
    console.log('e.target.name: ', e.target.name);
    console.log('e.target.value: ', e.target.value);
    console.log('==================');
  };

  const changeChildInput = (e: any, index: number) => {
    console.log('change child input');
    console.log('e.target.name: ', e.target.name);
    console.log('e.target.value: ', e.target.value);
    console.log('==================');
    const newRoom = roomMap.find((room, id) => id === index);
    if (newRoom) {
      const childNum = Number(e.target.value);
      const childPrice = rooms[index].childPrice
      const prevPriceWithoutChild = newRoom.price - (childPrice * newRoom.child);
      newRoom.child = childNum;
      newRoom.price = prevPriceWithoutChild + (childPrice * childNum);
      const newRoomMap = roomMap.map((room, id) => index === id ? newRoom : room);
      const newChild = newRoomMap.reduce((acc, curr)=>(acc + curr.child), 0);
      setRoomMap(newRoomMap);
      setCurrChild(newChild);
      onChange(roomMap);
    }
  };

  const blurChildInput = (e: any, index: number) => {
    console.log('blur child input');
    console.log('e.target.name: ', e.target.name);
    console.log('e.target.value: ', e.target.value);
    console.log('==================');
  };

  useEffect(() => {
    const defaultRooms = getDefaultRoomAllocation();
    const defaultAdult = defaultRooms.reduce((acc, curr)=>(acc + curr.adult), 0);
    const defaultChild = defaultRooms.reduce((acc, curr)=>(acc + curr.child), 0);
    setRoomMap(defaultRooms);
    setCurrAdult(defaultAdult);
    setCurrChild(defaultChild);
  }, []);

  return (
    <div className="w-96 lg:h-550 p-3">
      <div className="text-xl font-extrabold">
        {`住客人數: ${guest.adult} 位大人，${guest.child} 位小孩 / ${rooms.length} 房`}
        </div>
      <div className="bg-cyan-50 w-full border border-cyan-300 rounded-md p-5 mt-5 mb-2">
        <div className="text-base text-neutral-500">
          {`尚未分配人數: ${guest.adult - currAdult} 位大人，${guest.child - currChild} 位小孩`}
        </div>
      </div>
      <div className="overflow-y-auto lg:h-400">
        {roomMap.map((roomItem, index) => (
          <div 
            key={`room-${index}`} 
            className="p-2"
            style={{borderBottom: index !== roomMap.length - 1 ? '1px solid #ddd' : 'none'}}
          >
            <div className="text-lg font-semibold">
              {`房間: ${roomItem.adult + roomItem.child} 人`}
            </div>
            <div className="flex justify-between items-center text-base mt-2 mb-4">
              <div>
                <div>大人</div>
                <div className="text-gray-400">年齡 20+</div>
              </div>
              <InputNumber 
                min={roomItem.child ? 1 : 0}
                max={rooms[index].capacity - roomItem.child}
                step={1}
                name={`adult-${index}`}
                value={roomItem.adult}
                onChange={(e)=>changeAdultInput(e, index)}
                onBlur={(e)=>blurAdultInput(e, index)}
                disabled={false}
                left={guest.adult - currAdult}
              />
            </div>
            <div className="flex justify-between items-center text-base mt-2 mb-4">
                <div>小孩</div>
                <InputNumber 
                  min={0}
                  max={rooms[index].capacity - roomItem.adult}
                  step={1}
                  name={`child-${index}`}
                  value={roomItem.child}
                  onChange={(e)=>changeChildInput(e, index)}
                  onBlur={(e)=>blurChildInput(e, index)}
                  disabled={false}
                  left={guest.child - currChild}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
