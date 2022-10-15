import React, { Fragment, useEffect, useState } from 'react';
import Map, {Marker,Popup} from 'react-map-gl';
import Room from '@mui/icons-material/Room';
import Star from '@mui/icons-material/Star';
import axios from 'axios'
import {format} from 'timeago.js'
import "./app.css"
import Login from './components/Login';
import Register from './components/Register';


function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 50,
    zoom: 3.5
  });

  useEffect(()=>{
    const getPins = async ()=>{
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (error) {
        console.log(error)
      }
    };
    getPins();
  },[])

  const handleMarkerClick = (id, lat,long) =>{
    setCurrentPlaceId(id);
    setViewState({...viewState,
      latitude:lat,
      longitude:long
    })
  }

  const handleAddClick = (e) => {
    const lat = e.lngLat.lat
    const long = e.lngLat.lng

    setNewPlace({
      lat: lat,
      long: long,
    });
  };

  const handleLogout = ()=>{
    setCurrentUsername(null);
    myStorage.removeItem("user");
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const newPin = {
      username:currentUsername,
      title:title,
      desc:desc,
      rating:rating,
      lat:newPlace.lat,
      long:newPlace.long
    };

    try {
      const res = await axios.post("/pins", newPin)
      setPins([...pins, res.data])
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
     
 <Map
    style={{width:"100vw", height:"100vh"}}
    {...viewState}
    mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    onDblClick={handleAddClick}
  >
  {pins.map((p)=>(
<Fragment>
  <Marker 
    longitude={p.long} 
    latitude={p.lat} 
    anchor="bottom"  >
      <Room 
      style={{fontSize: viewState.zoom * 7, color: 
        currentUsername === p.username ? "tomato" : "slateblue", 
      cursor:"pointer"}} 
      onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
      />
  </Marker>
  
  {p._id === currentPlaceId && (
  <Popup 
    longitude={p.long} 
    latitude={p.lat} 
    anchor="left" 
    key={p._id} 
    closeOnClick={false} 
    closeButton={true} 
  >
      <div className='card'>
        <label>Place</label>
        <h4 className='place'>{p.title}</h4>
        <label>Review</label>
        <p className='desc'>{p.desc}</p>
        <label>Rating</label>
        <div className='stars'>
         {Array(p.rating).fill(<Star className='star' />)}
        </div>
        <label>Information</label>
        <span className='username'>Created By <b>{p.username}</b></span>
        <span className='date'>{format(p.createdAt)}</span>
      </div>
    </Popup>
  )}
  </Fragment>
      ))}
    {newPlace && (
      <Popup 
    longitude={newPlace.long} 
    latitude={newPlace.lat} 
    anchor="left" 
    closeOnClick={false} 
    closeButton={true} 
    onClose={()=> setNewPlace(null)}
  ><div>
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
      <label>Review</label>
      <input placeholder='Say something about this place' onChange={(e)=>setDesc(e.target.value)}/>
      <label>Rating</label>
      <select onChange={(e)=>setRating(e.target.value)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button className='submitButton' type='submit'>Add pin</button>
    </form>
  </div>
  </Popup>
  )}
      {currentUsername ? (
        <button className='button logout' onClick={handleLogout}>Log out</button>
        ) : (
        <div className='buttons'>
          <button className='button login' onClick={()=>setShowLogin(true)}>Login</button>
          <button className='button register' onClick={()=>setShowRegister(true)}>Register</button> 
        </div>
      )
    }
    {showRegister &&  <Register setShowRegister={ ()=>setShowRegister(false)} />}
    {showLogin &&  <Login setShowLogin={()=>setShowLogin(false)} myStorage={myStorage} setCurrentUsername={setCurrentUsername}/>}
  
  </Map>
    </div>
  );
}

export default App;
