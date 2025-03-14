import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoomsList, selectUsername } from '../redux/roomInfoSlice';
import { useNavigate } from 'react-router';
import { emitGetRooms } from '../redux/socketSlice';
import RoomTable from '../components/RoomTable';
import CreationRoom from '../components/CreationRoom';

const Rooms = () => {
  const username = useSelector((state) => selectUsername(state));
  const roomsList = useSelector((state) => selectRoomsList(state));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(emitGetRooms());
  }, [dispatch]);

  const handleSelectRoom = (roomName) => {
    navigate(`/${roomName}/${username}`);
  };

  return (
    // grid with 20 / 50 / 30 layout
    <div className="p-4 grid place-items-center grid-rows-[20%_50%_30%] h-screen">
      <div className="header w-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-center text-7xl font-bold">Room Selection</div>
        <p className="mb-4 text-3xl">Welcome {username}</p>
      </div>
      {roomsList.length !== 0 ? (
        <RoomTable roomsList={roomsList} onSelect={handleSelectRoom} />
      ) : (
        <p className="text-2xl">No rooms available</p>
      )}
      <CreationRoom handleSelectRoom={handleSelectRoom} />
    </div>
  );
};

export default Rooms;
