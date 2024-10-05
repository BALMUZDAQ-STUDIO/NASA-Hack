import React from 'react';
import classes from "./MemberCard.module.css";
const MemberCard = ({name,logo, role}) => {
    return (
        <div className={classes.main}>
            <p className={classes.p1_name}>{name}</p>
            <img className={classes.logo_img} src={logo}/>
            <p className={classes.p1_name} style={{color:"#747474", fontSize:"25px"}}>{role}</p>
        </div>
    );
};

export default MemberCard;