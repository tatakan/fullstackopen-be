import { useState, useEffect } from 'react'
import Service from './services/persons.js'
 //const showNumbers = showFiltered().map((x) => <p key = {x.name}>{x.name} {x.number}</p>)
 //const showFiltered = () => persons.filter((elem) => elem.name.toLowerCase().includes(filtered.toLowerCase()))

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState(persons)
  const [filter, setFilter] = useState('')

  const initialRead = () => {
    Service.read()
      .then((respArr) => setPersons(respArr) )
      .catch(error => {alert("cannot bring the entries from database, try to reload")})
  }
  useEffect(initialRead, [])



  //console.log(persons)
  const addPersonsHandle = (e) => {
    e.preventDefault()

    const newpersonobject = {
        name: newName,
        number: newNumber,
        id:persons.slice(-1)[0].id + 1 
    }

    const isAdded = persons.reduce((checker, elem) => (elem.name.toLowerCase() === newpersonobject.name.toLowerCase() ? true : checker ), false)
    

    if(isAdded){
      if(window.confirm(`${newpersonobject.name} is already added to phonebook, replace the old number with new one?`)) {
        const objIndex = persons.findIndex((x) => x.name.toLowerCase() === newpersonobject.name.toLowerCase(), newpersonobject)
        Service.update(newpersonobject, persons[objIndex].id)
        .then(setPersons(persons.map((elem, index) => index === objIndex ? newpersonobject : elem)))
        .catch(error => alert("changing info on existing entry has been unsuccesful"))

      }

    }else if(newpersonobject.name === undefined || newpersonobject.number === undefined){
      //console.log('empty')

    }else{
      Service.create0(newpersonobject)
        .catch(alert("creating new entry has been unsuccessful"));
      //console.log(persons.slice(-1)[0].id)
      //console.log(newpersonobject)
      setPersons(persons.concat(newpersonobject))
      //console.log('added')
      
    }
    
  }

  const inputHandle = ({target :{value}}, type) => {

    if (type === "name"){
      setNewName(value)
    }else if(type === "number"){
      setNewNumber(value)
    }else{
    }
  }

//persons.filter((elem) =>  elem.name.toLowerCase().includes(filter.toLowerCase()))
  const deletePersonHandle  = ({target :{value}}) => {
    Service.del(value)
      .then(setPersons(persons.filter((elem) => elem.id !== value)))
      .catch(error => alert("creating new entry has been unsuccessful"));
    //setPersons(persons.filter((elem) => !elem.id === value))
  }

  const filterboxHandle = ({target :{value}}) => {
    setFilter(value)
    //console.log(persons)
    //setFiltered 
  }

  const filterHandle = () => setFiltered(persons.filter((elem) =>  elem.name.toLowerCase().includes(filter.toLowerCase())))
  


  
  const ViewArray = () => (filter.length === 0) ? persons : filtered
  // eslint-disable-next-line
  useEffect(() => ViewArray, [filter])
  // eslint-disable-next-line
  useEffect(() => filterHandle, [filter])

  const personObj = {
    submithandler : addPersonsHandle, 
    handler : setPersons, 
    inputhandler : inputHandle,
    buffer : {
      name: newName,
      number : newNumber
    }

  }    
        
  return (
    <div>
      <h2>Phonebook</h2>
        <FilteredView filterhandler={filterboxHandle} filter = {filter} listArr={persons} ></FilteredView>
      <h3>Add a new</h3>
        <PersonForm props = {personObj}></PersonForm>
      <h3>Numbers</h3>
        <Persons listArr={ViewArray()} delHandler = {deletePersonHandle}></Persons>
    </div>
  )
}
const Persons = ({listArr, delHandler}) => listArr.map((x, index) => <p key={x.id}>{x.name} {x.number}<button onClick={delHandler} value={x.id}>delete</button></p>, delHandler)

const FilteredView = ({filter, filterhandler}) => {
  return (
    <div>
      <input value={filter} onChange = {filterhandler} />
    </div>
  )
}

const PersonForm = ({props:{inputhandler, submithandler, buffer}}) => {

  return (
    <form onSubmit={submithandler}>
    <div>
      name: <input value={buffer.name} onChange = {(e) => inputhandler(e, "name")}  /><br></br>
      number: <input value={buffer.number} onChange = {(e) => inputhandler(e, "number")}  />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )

}


export default App