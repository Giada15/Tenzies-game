import React from 'react'
import Die from "./Die"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import  useWindowSize  from 'react-use-window-size'
import './App.css'

let count = 0
let rollsArrayId 
let rollsArray = []
let arrayOfGames =[]

function App() {

  
  const [dice, setDice] = React.useState(generateArrObjects())
  const [gameOver, setGameOver] = React.useState (false)
  const [arrayOfGamesLS, setArrayOfGamesLS] = React.useState([])
  const [lowest, setLowest] = React.useState(0)

  const { width, height } = useWindowSize();
  
  React.useEffect(()=>{
    const allHeld = dice.every(die => die.isHeld)
    const allSameNum = dice.every(die => die.value === dice[0].value)

    if (allHeld && allSameNum){
      setGameOver(true)
    }
  }, [dice])

  function generateArrObjects(){
    const newArray = []
    for (let i=0; i<10; i++){
      newArray.push({
        value: Math.floor(Math.random()*6 +1),
        id: nanoid(),
        isHeld: false,
      })
    }
    return newArray
  }

  function switchIsHeld(id){
    setDice(prevDice =>{
      return prevDice.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld}: die
      })
    })
  }

  const diceNums = dice.map(die =>{
    return <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} switchIsHeld={switchIsHeld}/>
  })

  function rollDice(){
    trackRolls()
    if (gameOver){
      setGameOver(false)
      setDice(generateArrObjects())
      count = 0
    } else {
      setDice(prevDice => {
        return prevDice.map(die =>{
          return die.isHeld ? die : {
            value: Math.floor(Math.random()*6 +1),
            id: nanoid(),
            isHeld: false,
          }
        })
      })
    }
  }

  function trackRolls(){ 
    return count = count + 1
  }

  React.useEffect(()=>{ 
    if(count === 0 && !gameOver){
      rollsArray = []
      arrayOfGames.push({
        array: rollsArray
      }) 
    }else if (count !== 0 && !gameOver){
        rollsArray.push(count)
    }
  },[count]) 

  React.useEffect(()=>{
      localStorage.setItem("arrayOfGames", JSON.stringify(arrayOfGames))
      
      setArrayOfGamesLS(JSON.parse(localStorage.getItem("arrayOfGames")))
      
      const arrayOfRolls = arrayOfGamesLS.map(item=>{
        return item.array.length
      })  

      const arrayOfRollsFinal = arrayOfRolls.filter(item =>{
        return item > 0
      })

      if (arrayOfRollsFinal.length > 0){
        setLowest(Math.min(...arrayOfRollsFinal))
      }
      
  }, [gameOver])

  return (
    <div> 
      {gameOver && <Confetti width={width} height={height}/>}
      
      <main className="main-container">
        
        <h1 className='game-title'>Tenzies</h1>
        
        <p className='game-description'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

        <div className="dice-container">
          {diceNums}
        </div>
        
        <button className='btn' onClick={rollDice}>{gameOver ? "New Game" : "Roll"}</button>

        <div className='number-rolls-container'>
        <p className='number-rolls current'>Current score : {count}</p>
        {!gameOver && <p className='number-rolls best'>Best score : {lowest} </p>}
        </div>
        
      </main>
    </div>
  )
}

export default App
