import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePrinter, AiOutlineSave } from 'react-icons/ai';
import Contact from 'models/Contact';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import ReactToPrint from 'react-to-print';
import dbBuildings from 'models/Buildings'; 

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { MdAdUnits } from 'react-icons/md';


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  const Buildings = ({ dbVouchers, dbContacts }) => {
    
    const [open, setOpen] = useState(false)
    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)


    function handleRowCheckboxChange(e, id) {
      if (e.target.checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      }
    }

    useEffect(() => {
      setContacts(dbContacts)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }
    }, [])

    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')

    const [search, setSearch] = useState('')


    const [openExtraForm, setOpenExtraForm] = React.useState(1);
    const handleOpenExtraForm = (value) => setOpenExtraForm(openExtraForm === value ? 0 : value);
    

    const [nameInInvoice, setNameInInvoice] = useState('')
    const [lessorName, setLessorName] = useState('')
    const [adjective, setAdjective] = useState('')
    const [buildingType, setBuildingType] = useState('')
    const [idNumber, setIdNumber] = useState('')
    const [expID, setExpID] = useState('')
    const [bank, setBank] = useState('')
    const [passPortNumber, setPassPortNumber] = useState('')
    const [expPassPort, setExpPassPort] = useState('')
    const [nationality, setNationality] = useState('')
    const [ibanNo, setIbanNo] = useState('')
    const [vatRegistrationNo, setVatRegistrationNo] = useState('')
    const [bankAccountNumber, setBankAccountNumber] = useState('')
    const [tradeLicenseNo, setTradeLicenseNo] = useState('')
    
    const [buildingNameInArabic, setBuildingNameInArabic] = useState('')
    const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
    const [totalUnits, setTotalUnits] = useState('')
    const [unitsPerFloor, setUnitsPerFloor] = useState('')
    const [parkings, setParkings] = useState('')
    const [roof, setRoof] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [area, setArea] = useState('')
    const [mizan, setMizan] = useState('')
    const [plotArea, setPlotArea] = useState('')
    const [floor, setFloor] = useState('')
    const [buildingArea, setBuildingArea] = useState('')
    const [electricityMeterNo, setElectricityMeterNo] = useState('')
    const [titleDeedNo, setTitleDeedNo] = useState('')

    const [contractStartDate, setContractStartDate] = useState('')
    const [investmentStructure, setInvestmentStructure] = useState('')
    const [gracePeriodFrom, setGracePeriodFrom] = useState('')
    const [contractEndDate, setContractEndDate] = useState('')
    const [amount, setAmount] = useState('')
    const [gracePeriodTo, setGracePeriodTo] = useState('')
    const [paymentScheduling, setPaymentScheduling] = useState('')

    const [unitNo, setUnitNo] = useState(100)
    const [unitName, setUnitName] = useState('')
    const [unitRent, setUnitRent] = useState('')
    const [unitType, setUnitType] = useState('')
    const [unitUse, setUnitUse] = useState('')
    const [unitSize, setUnitSize] = useState('')
    const [bathroom, setBathroom] = useState('')
    const [parking, setParking] = useState('')
    const [balcony, setBalcony] = useState('')
    const [ac, setAc] = useState('')
    const [unitStatus, setUnitStatus] = useState('')
    const [noOfFunctionLoop, setNoOfFunctionLoop] = useState(1)

    const [receiveUnitsArray, setReceiveUnitsArray] = useState([])
    const [increment, setIncrement] = useState(100)


    useEffect(() => {
      
      let highestValue = receiveUnitsArray.reduce((max, item) => Math.max(max, item.unitNo), -Infinity);
      if(receiveUnitsArray.length === 0){
        setUnitNo(100)
      }
      else{
        setUnitNo(highestValue + 100)
      }

    }, [receiveUnitsArray])
    


    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if(name === 'tradeLicenseNo'){
        setTradeLicenseNo(value)
      }
      else if(name === 'noOfFunctionLoop'){
        setNoOfFunctionLoop(value)
      }
      else if(name === 'bankAccountNumber'){
        setBankAccountNumber(value)
      }
      else if(name === 'vatRegistrationNo'){
        setVatRegistrationNo(value)
      }
      else if(name === 'phoneNo'){
        setPhoneNo(value)
      }
      else if(name === 'ibanNo'){
        setIbanNo(value)
      }
      else if(name === 'nameInInvoice'){
        setNameInInvoice(value)
      }
      else if(name === 'lessorName'){
        setLessorName(value)
      }
      else if(name === 'adjective'){
        setAdjective(value)
      }
      else if(name === 'buildingType'){
        setBuildingType(value)
      }
      else if(name === 'bank'){
        setBank(value)
      }
      else if(name === 'idNumber'){
        setIdNumber(value)
      }
      else if(name === 'expID'){
        setExpID(value)
      }
      else if(name === 'passPortNumber'){
        setPassPortNumber(value)
      }
      else if(name === 'expPassPort'){
        setExpPassPort(value)
      }
      else if(name === 'nationality'){
        setNationality(value)
      }
      else if (name === 'buildingNameInArabic') {
        setBuildingNameInArabic(value);
      } 
      else if (name === 'buildingNameInEnglish') {
        setBuildingNameInEnglish(value);
      } 
      else if (name === 'totalUnits') {
        setTotalUnits(value);
      } 
      else if (name === 'unitsPerFloor') {
        setUnitsPerFloor(value);
      } 
      else if (name === 'parkings') {
        setParkings(value);
      } 
      else if (name === 'roof') {
        setRoof(value);
      } 
      else if (name === 'titleDeedNo') {
        setTitleDeedNo(value);
      } 
      else if (name === 'country') {
        setCountry(value);
      } 
      else if (name === 'city') {
        setCity(value);
      }
      else if (name === 'area') {
        setArea(value);
      }
      else if (name === 'mizan') {
        setMizan(value);
      } 
      else if (name === 'plotArea') {
        setPlotArea(value);
      } 
      else if (name === 'floor') {
        setFloor(value);
      } 
      else if (name === 'buildingArea') {
        setBuildingArea(value);
      } 
      else if (name === 'electricityMeterNo') {
        setElectricityMeterNo(value);
      }
      else if (name === 'contractStartDate') {
        setContractStartDate(value);
      } 
      else if (name === 'investmentStructure') {
        setInvestmentStructure(value);
      } 
      else if (name === 'gracePeriodFrom') {
        setGracePeriodFrom(value);
      } 
      else if (name === 'contractEndDate') {
        setContractEndDate(value);
      } 
      else if (name === 'amount') {
        setAmount(value);
      } 
      else if (name === 'gracePeriodTo') {
        setGracePeriodTo(value);
      } 
      else if (name === 'paymentScheduling') {
        setPaymentScheduling(value);
      }
      else if (name === 'unitName') {
        setUnitName(value);
      } 
      else if (name === 'unitRent') {
        setUnitRent(value);
      } 
      else if (name === 'unitType') {
        setUnitType(value);
      } 
      else if (name === 'unitUse') {
        setUnitUse(value);
      } 
      else if (name === 'unitSize') {
        setUnitSize(value);
      } 
      else if (name === 'bathroom') {
        setBathroom(value);
      } 
      else if (name === 'parking') {
        setParking(value);
      } 
      else if (name === 'balcony') {
        setBalcony(value);
      } 
      else if (name === 'ac') {
        setAc(value);
      } 
      else if (name === 'unitStatus') {
        setUnitStatus(value);
      }
      else if(name === 'email'){
        setEmail(value)
      }
      else if(name === 'search'){
        setSearch(value);
      }
      else if(name === 'attachment'){
        setAttachment(value)
      }
      else if(name === 'name'){
        setName(value)
        const newData = dbContacts.filter(item => item.name === value);
        if(newData.length > 0){
          setEmail(newData[0].email)
          setPhoneNo(newData[0].phoneNo)
          setCity(newData[0].city)
        }
        else{
          setEmail('')
          setPhoneNo('')
          setCity('')
        }
      }
    }

    // JV
    const submit = async(e)=>{
      e.preventDefault()

      // fetch the data from form to makes a file in local system
      const data = { receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email , path:'Buildings' };

      let res = await fetch(`/api/addEntry`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const editEntry = async(id)=>{
      setOpen(true)

      const data = { id, receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email , path:'Buildings' };
      
      let res = await fetch(`/api/editEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()
      
      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const delEntry = async()=>{

      const data = { selectedIds , path: 'Buildings' };
      let res = await fetch(`/api/delEntry`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const getData = async (id) =>{
      setOpen(true)
      setIsOpenSaveChange(false)

      const data = { id, path: 'Buildings' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){
        const {receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email} = response.data;
        
        let dbContractStartDate = moment(contractStartDate).utc().format('YYYY-MM-DD')
        let dbContractEndDate = moment(contractEndDate).utc().format('YYYY-MM-DD')
        let dbGracePeriodFromDate = moment(gracePeriodFrom).utc().format('YYYY-MM-DD')
        let dbGracePeriodToDate = moment(gracePeriodTo).utc().format('YYYY-MM-DD')
        let dbExpDate = moment(expID).utc().format('YYYY-MM-DD')
        let dbPassPortDate = moment(expPassPort).utc().format('YYYY-MM-DD')

        setId(response.data._id)
        setReceiveUnitsArray(receiveUnitsArray);
        setNameInInvoice(nameInInvoice);
        setLessorName(lessorName);
        setAdjective(adjective);
        setBuildingType(buildingType);
        setIdNumber(idNumber);
        setExpID(dbExpDate);
        setBank(bank);
        setPassPortNumber(passPortNumber);
        setExpPassPort(dbPassPortDate);
        setNationality(nationality);
        setIbanNo(ibanNo);
        setVatRegistrationNo(vatRegistrationNo);
        setBankAccountNumber(bankAccountNumber);
        setTradeLicenseNo(tradeLicenseNo);
        setBuildingNameInArabic(buildingNameInArabic);
        setBuildingNameInEnglish(buildingNameInEnglish);
        setTotalUnits(totalUnits);
        setUnitsPerFloor(unitsPerFloor);
        setParkings(parkings);
        setRoof(roof);
        setCountry(country);
        setCity(city);
        setArea(area);
        setMizan(mizan);
        setPlotArea(plotArea);
        setFloor(floor);
        setBuildingArea(buildingArea);
        setElectricityMeterNo(electricityMeterNo);
        setTitleDeedNo(titleDeedNo);
        setContractStartDate(dbContractStartDate);
        setInvestmentStructure(investmentStructure);
        setGracePeriodFrom(dbGracePeriodFromDate);
        setContractEndDate(dbContractEndDate);
        setAmount(amount);
        setGracePeriodTo(dbGracePeriodToDate);
        setPaymentScheduling(paymentScheduling);
        setAttachment(attachment);
        setName(name);
        setPhoneNo(phoneNo);
        setEmail(email);
      }
    }

    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

    // const filteredData = personList.filter((item)=>{
    //   return item.name.toLowerCase().includes(search.toLowerCase());
    // });

    let adjectives = ['Agent', 'Owner' ];
    let buildingTypes = ['Management', 'Owned', 'Investment']
    let bankAccounts = ['Dubai Islamic Bank', 'Meezan Bank', 'Ajman Bank', 'FAB']
    let nationalities = ['Jordian', 'UAE', 'Indian', 'Pakistani', 'Morco', 'Egypt']
    let countries = [ "United States", "China", "India", "Brazil", "Russia", "Japan", "United Kingdom", "Germany", "France", "Canada", "Australia", "South Korea", "Mexico", "Spain", "Italy", "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Argentina", "Chile", "South Africa", "Egypt", "Nigeria", "Kenya", "Saudi Arabia", "United Arab Emirates"];
    let cities = [ "New York City, USA", "Tokyo, Japan", "Mumbai, India", "Beijing, China", "London, United Kingdom", "Paris, France", "Moscow, Russia", "Cairo, Egypt", "Rio de Janeiro, Brazil", "Sydney, Australia", "Cape Town, South Africa", "Mexico City, Mexico", "Toronto, Canada", "Dubai, United Arab Emirates", "Seoul, South Korea", "Buenos Aires, Argentina", "Nairobi, Kenya"];
    let areas = [ "North America", "South America", "Europe", "Asia", "Africa", "Oceania", "Middle East", "Central America", "Caribbean", "Mediterranean", "Scandinavia", "Balkans", "Southeast Asia", "Pacific Islands", "Arctic"];
    let investmentStructures = [ 'Fixed', 'of Rent %', 'of Collection %' ]
    let paymentSchedulings = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let unitTypes = ['Studio', '1 BHK', '2 BHK', 'SHOP']
    let unitUses = ['Residencial', 'Commercial']
    let aces = ['Window', 'Split', 'Central']
    let unitStatuses = ['Available', 'Occupied', 'Booked', 'Hold', 'Rent Dispute']



    const saveUnit = async(e) => {
      e.preventDefault();

      let unitNoIncrement = unitNo; // Starting unitNo value

      for (let i = 0; i < noOfFunctionLoop; i++) {
        const data = { unitNo: unitNoIncrement, unitName, unitRent, unitType, unitUse, unitSize, bathroom, parking, balcony, ac, unitStatus};

        const indexToUpdate = receiveUnitsArray.findIndex((item) => item.unitNo === unitNo);

        if (indexToUpdate !== -1) {
          // Update the unit properties
          setReceiveUnitsArray((prevReceiveUnitsArray) => {
            const updatedArray = [...prevReceiveUnitsArray];
            updatedArray[indexToUpdate] = {
              ...updatedArray[indexToUpdate],
              ...data,
            };
            return updatedArray;
          });
        }
        else{
          setReceiveUnitsArray((prevReceiveUnitsArray) => {
            return [...prevReceiveUnitsArray, data];
          });
        }
    
        // Increment unitNo for the next iteration
        unitNoIncrement += increment;
      }

    }

    const editUnit = async(e, index) => {
      e.preventDefault();

      let editingdata = receiveUnitsArray[index];
      const { unitNo, unitName, unitRent, unitType, unitUse, unitSize, bathroom,
      parking, balcony, ac, unitStatus } = editingdata;

      setUnitNo(unitNo)
      setUnitName(unitName)
      setUnitRent(unitRent)
      setUnitType(unitType)
      setUnitUse(unitUse)
      setUnitSize(unitSize)
      setBathroom(bathroom)
      setParking(parking)
      setBalcony(balcony)
      setAc(ac)
      setUnitStatus(unitStatus)
    }

    const delUnit = async(indexToDelete) => {
      const updatedUnitsArray = [...receiveUnitsArray];
      updatedUnitsArray.splice(indexToDelete, 1);
      setReceiveUnitsArray(updatedUnitsArray);
    }


    const data = [
      {
        label: "Owner",
        value: "owner",
        icon: BiUserCircle,
        desc: (
          <div>

            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <select id="name" name="name" onChange={ handleChange } value={name} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select contacts</option>
                  {dbContacts.map((item, index)=>{
                    return <option key={index} value={item.name}>{item.name} - {item.type}
                    </option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="nameInInvoice" className="block text-sm font-medium text-gray-700">
                  Name In Invoice
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="nameInInvoice"
                  value={nameInInvoice}
                  id="nameInInvoice"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full">
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                  Phone No:
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="phoneNo"
                  value={phoneNo}
                  id="phoneNo"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="email"
                  value={email}
                  id="email"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="lessorName" className="block text-sm font-medium text-gray-700">
                  Lessor Name
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="lessorName"
                  value={lessorName}
                  id="lessorName"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="adjective" className="block text-sm font-medium text-gray-700">
                  Adjective
                </label>
                <select id="adjective" name="adjective" onChange={ handleChange } value={adjective} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select adjective</option>
                  {adjectives.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700">
                  Building Type
                </label>
                <select id="buildingType" name="buildingType" onChange={ handleChange } value={buildingType} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select building type</option>
                  {buildingTypes.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>

            <Accordion open={openExtraForm === 0} icon={<Icon id={1} open={openExtraForm} />}>
              <AccordionHeader onClick={() => handleOpenExtraForm(1)}>Add More? Then click!</AccordionHeader>
              <AccordionBody>
                <div>
                  <div className='flex space-x-4 mb-14'>
                    <div className="w-full">
                      <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                        ID Number
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="idNumber"
                        value={idNumber}
                        id="idNumber"
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="expID" className="block text-sm font-medium text-gray-700">
                        Expiry Date ID Number
                      </label>
                      <input 
                        type="date"
                        onChange={handleChange}
                        name="expID"
                        id="expID"
                        value={expID}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                        Bank
                      </label>
                      <select id="bank" name="bank" onChange={ handleChange } value={bank} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select bank</option>
                        {bankAccounts.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className='flex space-x-4 mb-14'>
                    <div className="w-full">
                      <label htmlFor="passPortNumber" className="block text-sm font-medium text-gray-700">
                        Passport Number
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="passPortNumber"
                        value={passPortNumber}
                        id="passPortNumber"
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="expPassPort" className="block text-sm font-medium text-gray-700">
                        Expiry Date Passport
                      </label>
                      <input 
                        type="date"
                        onChange={handleChange}
                        name="expPassPort"
                        id="expPassPort"
                        value={expPassPort}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                        Nationality
                      </label>
                      <select id="nationality" name="nationality" onChange={ handleChange } value={nationality} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select nationality</option>
                        {nationalities.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className='flex space-x-4 mb-14'>
                    <div className="w-full">
                      <label htmlFor="ibanNo" className="block text-sm font-medium text-gray-700">
                        IBAN Number
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="ibanNo"
                        value={ibanNo}
                        id="ibanNo"
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="vatRegistrationNo" className="block text-sm font-medium text-gray-700">
                        Vat Registration No
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="vatRegistrationNo"
                        id="vatRegistrationNo"
                        value={vatRegistrationNo}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
                        Bank Account Number
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="bankAccountNumber"
                        id="bankAccountNumber"
                        value={bankAccountNumber}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="tradeLicenseNo" className="block text-sm font-medium text-gray-700">
                        Trade License Number
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="tradeLicenseNo"
                        id="tradeLicenseNo"
                        value={tradeLicenseNo}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                </div>
                
              </AccordionBody>
            </Accordion>

            <div className="flex items-center justify-center w-full mt-10">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>

          </div>
        ),
      },
      {
        label: "Building Details",
        value: "buildingDetails",
        icon: HiOutlineBuildingOffice2,
        desc: (
          <div>

            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="buildingNameInArabic" className="block text-sm font-medium text-gray-700">
                  Building Name In Arabic
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="buildingNameInArabic"
                  value={buildingNameInArabic}
                  id="buildingNameInArabic"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="buildingNameInEnglish" className="block text-sm font-medium text-gray-700">
                  Building Name In English
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="buildingNameInEnglish"
                  value={buildingNameInEnglish}
                  id="buildingNameInEnglish"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-8/12">
                <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700">
                  Total Units
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="totalUnits"
                  value={totalUnits}
                  id="totalUnits"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-8/12">
                <label htmlFor="unitsPerFloor" className="block text-sm font-medium text-gray-700">
                  Units Per Floor
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitsPerFloor"
                  value={unitsPerFloor}
                  id="unitsPerFloor"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 mb-14'>
              <div className="w-8/12">
                <label htmlFor="parkings" className="block text-sm font-medium text-gray-700">
                  Parkings
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="parkings"
                  value={parkings}
                  id="parkings"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-8/12">
                <label htmlFor="roof" className="block text-sm font-medium text-gray-700">
                  Roof
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="roof"
                  value={roof}
                  id="roof"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-8/12">
                <label htmlFor="titleDeedNo" className="block text-sm font-medium text-gray-700">
                  Title Deed No
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="titleDeedNo"
                  value={titleDeedNo}
                  id="titleDeedNo"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select id="country" name="country" onChange={ handleChange } value={country} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select country</option>
                  {countries.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select id="city" name="city" onChange={ handleChange } value={city} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select city</option>
                  {cities.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Area
                </label>
                <select id="area" name="area" onChange={ handleChange } value={area} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select area</option>
                  {areas.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>
            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="mizan" className="block text-sm font-medium text-gray-700">
                  Mizan
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="mizan"
                  value={mizan}
                  id="mizan"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="plotArea" className="block text-sm font-medium text-gray-700">
                  Plot Area
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="plotArea"
                  value={plotArea}
                  id="plotArea"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="floor"
                  value={floor}
                  id="floor"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full">
                <label htmlFor="buildingArea" className="block text-sm font-medium text-gray-700">
                  Building Area
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="buildingArea"
                  value={buildingArea}
                  id="buildingArea"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full">
                <label htmlFor="electricityMeterNo" className="block text-sm font-medium text-gray-700">
                  Electricity Meter No
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="electricityMeterNo"
                  value={electricityMeterNo}
                  id="electricityMeterNo"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
            </div>
            <div className="flex items-center justify-center w-full mt-10">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>

          </div>
        ),
      },
      {
        label: "Management/Investment Details",
        value: "management",
        icon: BsCashCoin,
        desc: (
          <div>

            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700">
                 Contract Start Date
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="contractStartDate"
                  value={contractStartDate}
                  id="contractStartDate"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="investmentStructure" className="block text-sm font-medium text-gray-700">
                  Investment Structure
                </label>
                <select id="investmentStructure" name="investmentStructure" onChange={ handleChange } value={investmentStructure} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select investment structure</option>
                  {investmentStructures.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="gracePeriodFrom" className="block text-sm font-medium text-gray-700">
                  Grace Period From
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="gracePeriodFrom"
                  value={gracePeriodFrom}
                  id="gracePeriodFrom"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700">
                 Contract End Date
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="contractEndDate"
                  value={contractEndDate}
                  id="contractEndDate"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="amount"
                  value={amount}
                  id="amount"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="gracePeriodTo" className="block text-sm font-medium text-gray-700">
                  Grace Period To
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="gracePeriodTo"
                  value={gracePeriodTo}
                  id="gracePeriodTo"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className='flex space-x-4'>

              <div className="w-1/4">
                <label htmlFor="paymentScheduling" className="block text-sm font-medium text-gray-700">
                  Payment Scheduling
                </label>
                <select id="paymentScheduling" name="paymentScheduling" onChange={ handleChange } value={paymentScheduling} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select payment scheduling</option>
                  {paymentSchedulings.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>

          </div>
        ),
      },
      {
        label: "Receive Units",
        value: "receiveUnits",
        icon: MdAdUnits,
        desc: (
          <div>
            <div className='flex space-x-4 mb-14'>
              <div className="w-full">
                <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                  Unit No
                </label>
                <input
                  type="number"
                  name="unitNo"
                  value={unitNo}
                  id="unitNo"
                  className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled
                />
              </div>
              <div className="w-full">
                <label htmlFor="unitName" className="block text-sm font-medium text-gray-700">
                  Unit Name
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="unitName"
                  value={unitName}
                  id="unitName"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="unitRent" className="block text-sm font-medium text-gray-700">
                  Unit Rent
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitRent"
                  value={unitRent}
                  id="unitRent"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">
                  Unit Type
                </label>
                <select id="unitType" name="unitType" onChange={ handleChange } value={unitType} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select unit type</option>
                  {unitTypes.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="unitUse" className="block text-sm font-medium text-gray-700">
                  Unit Use
                </label>
                <select id="unitUse" name="unitUse" onChange={ handleChange } value={unitUse} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select unit use</option>
                  {unitUses.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>

              <div className="w-full">
                <label htmlFor="unitSize" className="block text-sm font-medium text-gray-700">
                  Unit Size
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitSize"
                  value={unitSize}
                  id="unitSize"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className='flex space-x-4 mb-14'>
              <div className="w-11/12">
                <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">
                  Bathroom
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="bathroom"
                  value={bathroom}
                  id="bathroom"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-11/12">
                <label htmlFor="parking" className="block text-sm font-medium text-gray-700">
                  Parking
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="parking"
                  value={parking}
                  id="parking"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-11/12">
                <label htmlFor="balcony" className="block text-sm font-medium text-gray-700">
                  Balcony
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="balcony"
                  value={balcony}
                  id="balcony"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="ac" className="block text-sm font-medium text-gray-700">
                  AC
                </label>
                <select id="ac" name="ac" onChange={ handleChange } value={ac} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select ac</option>
                  {aces.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="unitStatus" className="block text-sm font-medium text-gray-700">
                  Unit Status
                </label>
                <select id="unitStatus" name="unitStatus" value={unitStatus} onChange={ handleChange } className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select unit status</option>
                  {unitStatuses.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>

              <div className="w-11/12">
                <label htmlFor="noOfFunctionLoop" className="block text-sm font-medium text-gray-700">
                  No's to save
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="noOfFunctionLoop"
                  value={noOfFunctionLoop}
                  id="noOfFunctionLoop"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full mt-auto">
                <button onClick={(e)=>{saveUnit(e)}} className='ml-auto text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2'>
                  Save Unit
                  <AiOutlineSave className='text-xl ml-2'/>
                </button>
              </div>

            </div>

            <div className="mt-2 overflow-x-auto shadow-sm">
              <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                  <tr>
                    <th scope="col" className="py-4 pl-4">
                        Unit No
                    </th>
                    <th scope="col" className="px-1">
                        Unit Name
                    </th>
                    <th scope="col" className="p-1">
                        Unit Rent
                    </th>
                    <th scope="col" className="p-1">
                        Unit Type
                    </th>
                    <th scope="col" className="p-1">
                        Unit Use
                    </th>
                    <th scope="col" className="p-1">
                        Unit Size
                    </th>
                    <th scope="col" className="p-1">
                        Bathroom
                    </th>
                    <th scope="col" className="p-1">
                        Parking
                    </th>
                    <th scope="col" className="p-1">
                        Balcony
                    </th>
                    <th scope="col" className="p-1">
                        AC
                    </th>
                    <th scope="col" className="p-1">
                        Unit Status
                    </th>
                    <th scope="col" className="p-1">
                        Edit/Del
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receiveUnitsArray.map((item, index)=>{
                  return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="pl-4 py-3">
                      <div className=' text-black font-semibold'>{item.unitNo}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitName}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitRent}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitType}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitUse}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitSize}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.bathroom}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.parking}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.balcony}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.ac}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitStatus}</div>
                    </td>
                    <td className="flex items-center px-3 mr-5 space-x-4">
                      {/* <button type='button' onClick={()=>{getData(item._id)}} 
                          className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                          <AiOutlineEdit className='text-lg'/>
                        </button> */}
                      <button type='button' onClick={(e)=>{editUnit(e,index)}} 
                        className={`font-medium mt-3 text-blue-600 dark:text-blue-500 hover:underline`}>
                        <AiOutlineEdit className='text-xl my-auto font'/>
                      </button>

                      <button type='button' onClick={()=>{delUnit(index)}} 
                        className={`font-medium mt-3 text-blue-600 dark:text-blue-500 hover:underline`}>
                        <AiOutlineDelete className='text-xl my-auto font'/>
                      </button>

                    </td>
                        
                  </tr>})}
                  
                </tbody>
              </table>
              { receiveUnitsArray.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
            </div>

          </div>
        ),
      },
    ];

    

  return (
    <>
    <ProSidebarProvider>
    <style jsx global>{`
        footer {
          display: none;
        }
        header {
          display: none;
        }
      `}</style>
    <FullLayout>

      {/* React tostify */}
      <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-1 md:gap-6">
          <div className="md:col-span-1">
            <div className="pl-4 flex">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Buildings and Owners</h3>
              <button 
                onClick={()=>{
                  setOpen(true)
                  setId('')
                  setIsOpenSaveChange(true)
                  setReceiveUnitsArray([]);
                  setNameInInvoice('');
                  setLessorName('');
                  setAdjective('');
                  setBuildingType('');
                  setIdNumber('');
                  setExpID('');
                  setBank('');
                  setPassPortNumber('');
                  setExpPassPort('');
                  setNationality('');
                  setIbanNo('');
                  setVatRegistrationNo('');
                  setBankAccountNumber('');
                  setTradeLicenseNo('');
                  setBuildingNameInArabic('');
                  setBuildingNameInEnglish('');
                  setTotalUnits('');
                  setUnitsPerFloor('');
                  setParkings('');
                  setRoof('');
                  setCountry('');
                  setCity('');
                  setArea('');
                  setMizan('');
                  setPlotArea('');
                  setFloor('');
                  setBuildingArea('');
                  setElectricityMeterNo('');
                  setTitleDeedNo('');
                  setContractStartDate('');
                  setInvestmentStructure('');
                  setGracePeriodFrom('');
                  setContractEndDate('');
                  setAmount('');
                  setGracePeriodTo('');
                  setPaymentScheduling('');
                  setAttachment('');
                  setName('');
                  setPhoneNo('');
                  setEmail('');
                }} 
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} ml-auto bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
                New
              </button>
            </div>
          </div>
          <div className="mt-4 md:col-span-2 md:mt-0">
            <div className='flex justify-between'>

              <div className='w-1/4'>

                <div className="relative rounded-lg bg-gray-50 border-2 border-blue-800">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <div className='pl-8'>
                    <input value={search} onChange={handleChange} type="text" id="search" name='search' className="block w-full p-2 text-sm text-gray-900 rounded-lg bg-gray-50 outline-none placeholder:text-gray-500" placeholder="Search Buildings..." required/>
                  </div>
                </div>
              </div>

              <div className='flex'>

                <button onClick={delEntry}
                  className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
                  >
                    Delete
                  <AiOutlineDelete className='text-lg ml-2'/>
                </button>

                <ReactToPrint
                  trigger={()=>{
                    return <button 
                      type='button'
                      className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                      Print All
                      <AiOutlinePrinter className='text-lg ml-2'/>
                    </button>
                  }}
                  content={() => componentRef.current}
                  documentTitle='Buildings and Owners'
                  pageStyle='print'
                />

              </div>
            
            </div>
            <form method="POST">
              <div className="overflow-hidden shadow sm:rounded-md">
                
                <div className="mt-2 overflow-x-auto shadow-sm">
                  <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-[11px] text-gray-700 uppercase bg-[#e9ecf7]">
                      <tr className=''>
                        <th scope="col" className="p-4">
                          <div className="flex items-center">
                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          </div>
                        </th>
                        <th scope="col" className="p-1">
                            Building Name
                        </th>
                        <th scope="col" className="p-1">
                            Building Type
                        </th>
                        <th scope="col" className="p-1">
                            Owner
                        </th>
                        <th scope="col" className="p-1">
                            Area
                        </th>
                        <th scope="col" className="p-1">
                            Start Date
                        </th>
                        <th scope="col" className="p-1">
                            End Date
                        </th>
                        <th scope="col" className="p-1">
                            Investment
                        </th>
                        <th scope="col" className="w-[80px]">
                            Investment Structure
                        </th>
                        <th scope="col" className="p-1">
                          View/Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbVouchers.map((item, index)=>{
                      return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input id="checkbox-table-search-1" type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          </div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=' text-black font-semibold'>{item.buildingNameInEnglish}</div>
                        </td>
                        <td className="p-1">
                          <div className=''>{item.buildingType}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.nameInInvoice}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.area}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{moment(item.contractStartDate).format('D MMM YYYY')}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{moment(item.contractEndDate).format('D MMM YYYY')}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{parseInt(item.amount).toLocaleString()}</div>
                        </td>
                        <td className="p-1">
                          <div className=''>{item.investmentStructure}</div>
                        </td>
                        <td className="flex items-center px-3 mr-5 py-4 space-x-4">
                          <button type='button' onClick={()=>{getData(item._id)}} 
                            className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                            <AiOutlineEdit className='text-lg'/>
                          </button>
                        </td>
                            
                      </tr>})}
                      
                    </tbody>
                  </table>
                  { dbVouchers.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={()=>{setOpen(false)}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-7xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6">
                    <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className='w-full'>
                      <form method="POST" onSubmit={(e)=>{submit(e)}}>
                        <div className="overflow-hidden shadow sm:rounded-md">
                          <div ref={speceficComponentRef} className="bg-white py-5">


                            <Tabs value="owner">
                              <TabsHeader className='bg-[#f0f3f4]'>
                                {data.map(({ label, value, icon }) => (
                                  <Tab key={value} value={value}>
                                    <div className="flex items-center gap-2">
                                      {React.createElement(icon, { className: "w-5 h-5" })}
                                      {label}
                                    </div>
                                  </Tab>
                                ))}
                              </TabsHeader>
                              <TabsBody className='mt-5'>
                                {data.map(({ value, desc }) => (
                                  <TabPanel key={value} value={value}>
                                    {desc}
                                  </TabPanel>
                                ))}
                              </TabsBody>
                            </Tabs>

                            <div className="bg-gray-50 space-x-3 px-4 py-3 text-right sm:px-6">

                              <ReactToPrint
                                trigger={()=>{
                                  return <button 
                                    type="button"
                                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                    Print
                                    <AiOutlinePrinter className='text-lg ml-2'/>
                                  </button>
                                }}
                                content={() => speceficComponentRef.current}
                                documentTitle='Building and Owner'
                                pageStyle='print'
                              />

                              <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Changes</button>
                              {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

    </FullLayout>
    </ProSidebarProvider>

    </>
  )
}



export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState){
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI)
  }
  let dbVouchers = await dbBuildings.find()
  let dbContacts = await Contact.find()

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
    }
  }
}   
export default Buildings;