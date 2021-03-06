import React from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Icon from "@material-ui/core/Icon";
import feedback from "../../chat.png";
import Spinner from "../Spinner/Spinner"; 

import "./styles.scss";

export default props => {
    const { fetchMapDataLoading, mapDataList, toggleSideMenu, isSideMenuOpen } = props;
    const mapRef = React.useRef(null);
    const position = [23.6374115,120.8873666];
    const [state, setState] = React.useState({
        markerList: [],
        bond:[[25.268576, 121.611722], [23.879299, 120.294881], [23.762836, 121.544090], [21.257621, 120.740482], [21.899800, 120.837252]]
    });

    const openFeedback = (e) => {
        e.stopPropagation()
        window.open("https://docs.google.com/forms/d/e/1FAIpQLSdO9A9-LVmdGM5cgIHw7N_G4pZvhrtPTmYop0fPy6eNBmJwrQ/viewform", "_blank")
    };

    React.useEffect(()=>{
        if(Object.entries(mapDataList).length > 0){
            const updateMapList = [];
            const updateBonds = [];
            Object.entries(mapDataList).map(marker=>{
                updateMapList.push({
                    key: marker[0],
                    ...marker[1]
                });
                updateBonds.push([+marker[1].longitude, +marker[1].latitude]);
             });

            setState(state=>({
            ...state,
            markerList: updateMapList,
            bond: updateBonds
            }))
        };
      },[mapDataList])

      console.log(state)

      if(fetchMapDataLoading){
          return <div className="containers-spinner"><Spinner /></div>
      }else{
        return (
            <div className="containers">
                <div className="button-container">
                    <Icon onClick={toggleSideMenu}>{!isSideMenuOpen ? "arrow_forward_ios_icon" : "arrow_back_ios_icon"}</Icon>
                </div>
                <MapContainer 
                    ref={mapRef}
                    center={position}
                    zoom={8} 
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="map"
                    animate={true}
                    tap={false}
                >
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomright" />
                    <div 
                        className="feedback" 
                        onClick={openFeedback}
                        >
                        <img src={feedback} className="feedback-img" alt="feedback"/>
                        <p>?????????????????????</p>
                    </div>
                    <MarkerClusterGroup>
                            {state.markerList.map(marker=> 
                                <Marker position={[marker.latitude, marker.longitude]} key={marker.key}>
                                    <Popup>
                                        <h4>????????????: <a href={marker["url"]} target="_blank" rel="noreferrer"> {marker["shop_name"]} </a> </h4>
                                        <p>??????????????????: {marker["prevention_measures"]}</p>
                                        <p>???????????????????????????: {marker["inside"] === ''? '?????????': (marker["inside"]? '???' : '???')}</p>
                                        <p>??????????????????: {marker["inside_status"]}</p>
                                        <p>??????????????????: {marker["outside"] === ''? '?????????': (marker["outside"]? '???' : '???')}</p>
                                        <p>??????????????????: {marker["delivery"] === ''? '?????????': (marker["delivery"]? '???' : '???')}</p>
                                        <p>????????????????????????: {marker["open"]? '???' : '???'}</p>
                                        <p>????????????: {new Date(marker["last_updated_at"] * 1000).toLocaleString('lt-LT', { timeZone: 'Asia/Taipei' })}</p>
                                        <p>????????????????????????: {marker["open_time_change"]}</p>
                                        <p>???????????????????????????: {marker["discount"]}</p>
                                    </Popup>
                                </Marker>
                            )}
                     </MarkerClusterGroup>
                </MapContainer>
            </div>
            )
    }
      }

