function Die (props) {
    const styles ={
        // backgroundColor : props.isHeld? "#59E391" : "white"
        backgroundImage: props.isHeld ? `url(../images/${props.value}isHeld.png)` : `url(../images/${props.value}.png)`,
        backgroundSize: "cover"
    }

    return (
            <div className="die" style={styles} onClick ={() => props.switchIsHeld(props.id)}>
                <h3></h3>
            </div>
    )
}

export default Die