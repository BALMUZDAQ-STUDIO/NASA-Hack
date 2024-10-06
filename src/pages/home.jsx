import React, {useEffect} from 'react';

import WebFont from 'webfontloader';
import '../App.css';
import Spline from '@splinetool/react-spline';
import MyButton from "../components/button/MyButton"
import MemberCard from "../components/memberCard/MemberCard";
import {BrowserRouter, Link, Route} from 'react-router-dom'
const Home = () => {
    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Jersey 25", "sans-serif"]
            }
        });
        WebFont.load({
            google: {
                families: ["IBM Plex Mono", "monospace"]
            }
        });
    }, []);
    function scrollToTop(){
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    return (
        <div style={{height: '100%', width: '100%', backgroundColor: 'black'}}>

            <Spline scene="https://prod.spline.design/R2CaURpdEjrfi3er/scene.splinecode"
                    style={{display: "flex", position: 'absolute', top: -50, left: 0, zIndex: 0}}/>
            <div style={{display: "flex", zIndex: 2, flexDirection: 'column'}}>
                <div style={{display: 'flex', width: "740px", marginTop: "110px", marginLeft: "148px"}}>
                    <h1 style={{display: 'flex'}}>
                        Welcome to Orrery Web App
                    </h1>

                </div>
                <Link to='/planetarium'><MyButton  style={{marginLeft: "148px", marginTop: "80px"}}> Start now</MyButton></Link>
            </div>

            <div style={{zIndex: 2, marginTop: '200px', marginLeft: "128px"}}>
                <h1>About project</h1>
                <div style={{
                    backgroundColor: "white",
                    width: "1200px",
                    height: "12px",
                    marginTop: "20px",
                    borderRadius: "10px"
                }}></div>
                <div style={{display: "flex", flexDirection: "row", marginTop: "50px"}}>
                    <h3 style={{width: "515px"}}>Welcome to Orerry by Balmuzdaq Studio. Here we used modern technologies
                        such as Three.js, React and NASA resources. Thanks to this, we were able to display all the
                        objects
                        of our solar system here. Here young explorers will be able to see all the wonders of our
                        galaxy.</h3>
                    <div style={{
                        marginLeft: "130px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#181818",
                        width: "520px",
                        height: "520px",
                        borderRadius: 100,
                        border: "5px solid white"
                    }}>
                        <img style={{width: "420px", height: "152px"}} src={require("../assets/images/Nasa_image.png")}
                             alt={"logo"}/>
                    </div>
                </div>
            </div>

            <div style={{zIndex: 2, marginTop: '160px', marginLeft: "128px"}}>
                <h1>Team members</h1>
                <div style={{
                    backgroundColor: "white",
                    width: "930px",
                    height: "12px",
                    marginTop: "20px",
                    borderRadius: "10px"
                }}></div>
            </div>
            <div style={{alignItems: "center", justifyContent: "center", width: "100wh", textAlign: "center"}}>
                <img src={require("../assets/images/Balmuzdaq_white.png")}
                     style={{marginTop: "50px", textAlign: "center", justifyContent: "center"}}/>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    margin: "0px 128px"
                }}>
                    <MemberCard name="Akhmedov Daler" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="UX/UI designer"/>
                    <MemberCard name="Chzan-Vin-Zin Maxim" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="Team Leader"/>
                    <MemberCard name="Mailybaev Adilet" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="Frontend Developer"/>

                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: "100px",
                    margin: "50px 128px"
                }}>
                    <MemberCard name="Sachev Andrey" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="Fullstack Developer"/>
                    <MemberCard name="Oryntai Kaisar" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="Backend Developer"/>
                    <MemberCard name="Meder Dzahanger" logo={require("../assets/images/BALMUZDAQ_LOGO__v2.png")}
                                role="3D Designer"/>
                </div>
            </div>
            <div style={{
                backgroundColor: "white",
                width: "1460px",
                height: "4px",
                margin: "0px 128px",
                marginTop: "30px",
                borderRadius: "10px"
            }}></div>
            <div style={{
                display: 'flex',
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "20px 60px",
                alignItems: 'start'
            }}>
                <img src={require("../assets/images/Balmuzdaq_white.png")} style={{width: "650px", height: "130px"}}/>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <h4 style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        Contacts:
                        <p style={{fontSize: 20, marginTop: 20}}>+7 777 777 7777</p>
                        <p style={{fontSize: 20}}>+7 777 777 7777</p>
                        <p style={{fontSize: 20}}>+7 777 777 7777</p>
                    </h4>

                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'start',
                    justifyContent: 'start',
                    marginTop: 10
                }}>
                    <h4 style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                        Our website:
                        <p style={{fontSize: 20, marginTop: 20}}>Balmuzdaq.xyz</p>
                    </h4>
                </div>
                <div></div>
                <a><MyButton children="Return"
                             style={{width: 200, height: 75, borderRadius: "25px", fontSize: "30px", marginTop: 20}}
                             onClick={() => {
                                 scrollToTop()
                             }}/></a>
            </div>

        </div>
    );
};

export default Home;