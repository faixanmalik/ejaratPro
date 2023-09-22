import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle, AiOutlinePrinter } from 'react-icons/ai';
import dbReceiptVoucher from 'models/ReceiptVoucher';
import Contact from 'models/Contact';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import Employees from 'models/Employees';
import ReactToPrint from 'react-to-print';
import PaymentType from 'models/PaymentMethod';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import BankAccount from 'models/BankAccount';
import numberToWords from 'number-to-words';
import Project from 'models/Project';
import PaymentMethod from 'models/PaymentMethod';


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const ReceiptVoucher = ({ dbCreditSalesInvoice, dbVouchers, dbProject, dbBankAccount, dbPaymentMethod, dbContacts, dbEmployees, }) => {
    
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
      setContacts(dbContacts, dbEmployees)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }
    }, [])

    // JV
    const [journalNo, setJournalNo] = useState(`RV-${dbVouchers.length === 0 || !dbVouchers[dbVouchers.length - 1].journalNo
      ? dbVouchers.length + 1
      : parseInt(dbVouchers[dbVouchers.length - 1].journalNo.slice(3)) + 1}`)

    // Date
    const today = new Date().toISOString().split('T')[0];
    const [journalDate, setJournalDate] = useState(today)
  
    const [memo, setMemo] = useState('')
    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [amount, setAmount] = useState('')
    const [totalPaid, setTotalPaid] = useState(0)
    const [reference, setReference] = useState('')
    const [project, setProject] = useState('')


    // JV
    const [inputList, setInputList] = useState([
      { id: '', againstBill: '', journalNo:journalNo, date: journalDate, dueDate:'', paidBy:'', desc:'', bank:'', ref:'', paid: 0},
      { id: '', againstBill: '', journalNo:journalNo, date: journalDate, dueDate:'', paidBy:'', desc:'', bank:'', ref:'', paid: 0},
    ]);


    const [filteredInvoices, setFilteredInvoices] = useState(dbCreditSalesInvoice)


     // RV
    const addLines = () => {
      setInputList([...inputList,
        {id: '', journalNo:journalNo, date: journalDate, dueDate:'', paidBy:'', desc:'', bank:'', ref:'', paid: 0},
      ])
    }
    const delLines = (indexToDelete) => {
        const updatedInputList = [...inputList];
        updatedInputList.splice(indexToDelete, 1);
        setInputList(updatedInputList);
    };

    // RV
    const handleChange = (e) => {
      if(e.target.name === 'journalDate'){
        setJournalDate(e.target.value)
      }
      else if(e.target.name === 'amount'){
        setAmount(e.target.value)
      }
      else if(e.target.name === 'city'){
        setCity(e.target.value)
      }
      else if(e.target.name === 'project'){
        setProject(e.target.value)
      }
      else if(e.target.name === 'email'){
        setEmail(e.target.value)
      }
      else if(e.target.name === 'phoneNo'){
        setPhoneNo(e.target.value)
      }
      else if(e.target.name === 'memo'){
        setMemo(e.target.value)
      }
      else if(e.target.name === 'reference'){
        setReference(e.target.value)
      }
      else if(e.target.name === 'attachment'){
        setAttachment(e.target.value)
      }
      else if(e.target.name === 'type'){
        setType(e.target.value)
      }
      else if(e.target.name === 'name'){
        setName(e.target.value)

        let filteredData = dbCreditSalesInvoice.filter(item => item.name === e.target.value);

        if(filteredData.length > 0){
          setFilteredInvoices(filteredData)
        }
        else{
          setFilteredInvoices([])
        }

        
        const newData = dbContacts.filter(item => item.name === e.target.value);
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

    // RV
    const submit = async(e)=>{
      e.preventDefault()
      
      inputList.forEach(item => {
        item.date = journalDate;
      });

      // fetch the data from form to makes a file in local system
      const data = { phoneNo, email, city, reference, amount:totalPaid, inputList, name,  memo, journalDate, journalNo, totalPaid, project, attachment, path:'ReceiptVoucher' };

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


    const delEntry = async()=>{

      const data = { selectedIds , path: 'ReceiptVoucher' };
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

      const data = { id, path: 'ReceiptVoucher' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){
        const dbJournalDate = moment(response.data.journalDate).utc().format('YYYY-MM-DD')
        
        setId(response.data._id)
        setJournalDate(dbJournalDate)
        setJournalNo(response.data.journalNo)
        setInputList(response.data.inputList)

        let data = response.data.inputList;
        let number = 0;
        data.forEach(element => {
          number += parseInt(element.paid);
        });
        setTotalPaid(number)
        setAmount(number)

        setMemo(response.data.memo)
        setName(response.data.name)
        setReference(response.data.reference)
        setAttachment(response.data.attachment.data)
        setPhoneNo(response.data.phoneNo)
        setName(response.data.name)
        setProject(response.data.project)
        setEmail(response.data.email)
        setCity(response.data.city)
        setAmount(response.data.amount)
      }
    }



    const change = (e, index) => {

      const values = [...inputList];
      values[index][e.target.name] = e.target.value;
      setInputList(values);


      var totalPaid = 0;
      for (let index = 0; index < inputList.length; index++) {
        totalPaid += parseInt(inputList[index].paid ? inputList[index].paid : 0);
      }
      setTotalPaid(totalPaid)
    }


    const newStateSettings = ()=>{

      setOpen(true)
      setId('')
      setJournalDate(today)

      setJournalNo(`RV-${dbVouchers.length === 0 || !dbVouchers[dbVouchers.length - 1].journalNo
        ? dbVouchers.length + 1
        : parseInt(dbVouchers[dbVouchers.length - 1].journalNo.slice(3)) + 1}`)
      
      setMemo('')
      setAttachment('')
      setPhoneNo(0)
      setName('')
      setEmail('')
      setTotalPaid(0)
      setReference('')
      setProject('')
      setCity('')
      setAmount('')
      setIsOpenSaveChange(true)

    }


   

    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

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
          <div className="px-4 sm:px-0 flex">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Receipt Vouchers</h3>
            <button
              type='button'
              onClick={newStateSettings}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} ml-auto bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              New
            </button>
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">
        <div className='flex'>
            <button
              type='button' 
              onClick={delEntry}
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
              documentTitle='Receipt Vouchers'
              pageStyle='print'
            />
          </div>
          <form method="POST">
            <div className="overflow-hidden shadow sm:rounded-md">
              
              <div className="overflow-x-auto shadow-sm">
                <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                      </th>
                      <th scope="col" className="p-1">
                          Voucher No
                      </th>
                      <th scope="col" className="p-1">
                          Date
                      </th>
                      <th scope="col" className="p-1">
                          Name
                      </th>
                      <th scope="col" className="p-1">
                          Reference
                      </th>
                      <th scope="col" className="p-1">
                          Total Amount
                      </th>
                      <th scope="col" className="p-1">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbVouchers.map((item, index)=>{
                    return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input id="checkbox-table-search-1" type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{item.journalNo}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{moment(item.journalDate).utc().format('D MMM YYYY')}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.name}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.reference}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.totalPaid}</div>
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
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-0 lg:max-w-full">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:py-8">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={submit}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div ref={speceficComponentRef} className="bg-white px-4 py-5 sm:p-6">

                          <div className='flex space-x-4 mb-14'>

                            <div className="w-full">
                              <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700">
                                Journal Date:
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="journalDate"
                                id="journalDate"
                                value={journalDate}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="journalNo" className="block text-sm font-medium text-gray-700">
                                Journal No:
                              </label>
                              <input
                                type="text"
                                name="journalNo"
                                value={journalNo}
                                id="journalNo"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 mb-14'>
                            
                            <div className="w-full">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name:
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

                            <div className="w-full">
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City:
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="city"
                                value={city}
                                id="city"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 mb-14'>
                            
                            <div className="w-1/3">
                              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                                Reference:
                              </label>
                              <input
                                type="text"
                                name="reference"
                                value={reference}
                                onChange={handleChange}
                                id="reference"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-1/3">
                              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                Project:
                              </label>
                              <select id="project" name="project" onChange={ handleChange } value={project} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select project</option>
                                {dbProject.map((item, index)=>{
                                  return <option key={index} value={item.projectName}>{item.projectName}</option>
                                })}
                              </select>
                            </div>

                            <div className="w-1/3">
                              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount:
                              </label>
                              <input
                                type="number"
                                name="amount"
                                value={totalPaid}
                                id="amount"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                          </div>


                          <div className='space-x-4'>
                            <table className="w-full text-sm text-left text-gray-500 overflow-x-scroll ">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                  <th scope="col" className="p-2 min-w-[20px]">
                                      Sr. 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Against Bill 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Paid By 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Description 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Due Date 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Bank 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[100px]">
                                      Reference 
                                  </th>
                                  <th scope="col" className="p-2 min-w-[130px]">
                                      Paid
                                  </th>
                                  <th scope="col" className="p-2">
                                      Add/Del
                                  </th>
                                </tr>
                              </thead>
                            
                              <tbody>
                              {inputList.map(( item , index)=>{

                                return <tr key={index} className="bg-white flex-col text-black border-b hover:bg-gray-50">

                                  <td className="p-2 min-w-[20px]">
                                    {index + 1}
                                  </td>

                                  <td className="p-2 min-w-[100px]">
                                    <select id="againstBill" name="againstBill" onChange={ e=> change(e, index) } value={item.againstBill} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                      <option value=''>unpaid Bills</option>
                                      {filteredInvoices.map((item, index)=>{
                                        return <option key={index} value={item.billNo}>{item.billNo}</option>
                                      })}
                                    </select>
                                  </td>

                                  <td className="p-2 min-w-[130px]">
                                    <select id="paidBy" name="paidBy" onChange={ e=> change(e, index) } value={item.paidBy} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                      <option value=''>paid By</option>
                                      {dbPaymentMethod.map((item, index)=>{
                                        return <option key={index} value={item.paymentType}>{item.paymentType}</option>
                                      })}
                                    </select>
                                  </td>

                                  <td className="p-2 min-w-[150px]">
                                    <input
                                      type="text"
                                      value={ item.desc }
                                      onChange={e=> change(e, index)}
                                      name="desc"
                                      id="desc"
                                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                  <td className="p-2 min-w-[150px]">
                                    <input
                                      type="date"
                                      value={ item.dueDate }
                                      onChange={e=> change(e, index)}
                                      name="dueDate"
                                      id="dueDate"
                                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      required
                                    />
                                  </td>

                                  <td className="p-2 min-w-[170px]">
                                    <select id="bank" name="bank" onChange={ e=> change(e, index) } value={item.bank} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                      <option value=''>select bank</option>
                                      {dbBankAccount.map((item, index)=>{
                                        return <option key={index} value={item.bankBranch}>{item.bankBranch}</option>
                                      })}
                                    </select>
                                  </td>

                                  <td className="p-2 min-w-[100px]">
                                    <input
                                      type="text"
                                      value={ item.ref }
                                      onChange={e=> change(e, index)}
                                      name="ref"
                                      id="ref"
                                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                  <td className="p-2 min-w-[130px]">
                                    <input
                                      type="number"
                                      value={ item.paid }
                                      onChange={e=> change(e, index)}
                                      name="paid"
                                      id="paid"
                                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                  <td className="p-1 flex items-center mt-[18px]">
                                    <button type='button' className='mx-auto' onClick={addLines}><AiOutlinePlusCircle className='text-xl text-green-600'/></button>
                                    <button type='button' className='mx-auto'><AiOutlineDelete onClick={()=>index != 0 && delLines(index)} className='text-xl text-red-700'/></button>
                                  </td>

                                </tr>})}

                              </tbody>
                            </table>
                            { inputList.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                          </div>

                          <div className='flex mt-5 my-auto items-center'>

                            <div className='w-1/2 ml-16'>
                              <input
                                type="text"
                                value={ numberToWords.toWords(totalPaid).toUpperCase() }
                                name="paid"
                                id="paid"
                                className="p-2 py-3 font-semibold text-3xl block w-full rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className='ml-auto flex space-x-3'>
                                <h1 className='text-base mt-2 font-bold'>TOTAL AMOUNT:</h1>
                              <div>
                                <input
                                  type="number"
                                  value={ totalPaid }
                                  name="paid"
                                  id="paid"
                                  className="cursor-not-allowed p-2 block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                            </div>
                            

                          </div>
      

                          <div className="mt-28">
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                              Memo:
                            </label>
                            <textarea cols="30" rows="4" type="text"
                                name="memo"
                                onChange={handleChange}
                                id="memo"
                                value={memo}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </textarea>
                          </div>
                            
                          {/* <div className="mt-7">
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                                Attachment:
                            </label>
                            <input
                                type="file"
                                onChange={handleChange}
                                name="attachment"
                                value={attachment}
                                id="attachment"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                multiple
                            />
                          </div> */}

                        </div>
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
                            documentTitle='Receipt Voucher'
                            pageStyle='print'
                          />

                          {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>}
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
  let dbVouchers = await dbReceiptVoucher.find()
  let dbContacts = await Contact.find()
  let dbEmployees = await Employees.find()
  let dbAccounts = await Charts.find()
  let dbProject = await Project.find()
  let dbPaymentMethod = await PaymentMethod.find()
  let dbBankAccount = await BankAccount.find()

  let dbCreditSalesInvoice = await CreditSalesInvoice.find({billStatus: 'unpaid'})

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)), 
      dbAccounts: JSON.parse(JSON.stringify(dbAccounts)),
      dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)), 
      dbProject: JSON.parse(JSON.stringify(dbProject)), 
      dbEmployees: JSON.parse(JSON.stringify(dbEmployees)),
      dbBankAccount: JSON.parse(JSON.stringify(dbBankAccount)),
      dbCreditSalesInvoice: JSON.parse(JSON.stringify(dbCreditSalesInvoice)), 
    }
  }
}   
export default ReceiptVoucher