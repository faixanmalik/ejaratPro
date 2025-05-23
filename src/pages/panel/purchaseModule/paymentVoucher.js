import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle, AiOutlinePrinter } from 'react-icons/ai';
import dbPaymentVoucher from 'models/PaymentVoucher';
import Contact from 'models/Contact';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import Employees from 'models/Employees';
import ReactToPrint from 'react-to-print';
import PaymentType from 'models/PaymentMethod';
import PurchaseInvoice from 'models/PurchaseInvoice';
import useTranslation from 'next-translate/useTranslation';


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const PaymentVoucher = ({ userEmail, dbVouchers, dbPurchaseInvoice, dbPaymentMethod, dbContacts, dbEmployees, dbAccounts }) => {
    
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('modules')

    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);
    const [filteredData, setFilteredData] = useState(dbPurchaseInvoice)

    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [filteredCharts, setFilteredCharts] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])
    const [filteredPaymentMethod, setFilteredPaymentMethod] = useState([])

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

      let filteredInvoices = dbVouchers.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      let filteredCharts = dbAccounts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredCharts(filteredCharts)

      let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredContacts(filteredContacts)

      let filteredPaymentMethod = dbPaymentMethod.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredPaymentMethod(filteredPaymentMethod)

    }, [userEmail])


    // JV
    const [journalNo, setJournalNo] = useState('')

    // Date
    const today = new Date().toISOString().split('T')[0];
    const [journalDate, setJournalDate] = useState(today)
  
    const [memo, setMemo] = useState('')
    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [paidBy, setPaidBy] = useState('')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')

    const [totalBalance, setTotalBalance] = useState(0)
    const [totalPaid, setTotalPaid] = useState(0)
    const [totalNetBalance, setTotalNetBalance] = useState(0)


    // JV
    const [inputList, setInputList] = useState('');
    const [reference, setReference] = useState('')

    // JV
    const handleChange = (e) => {
      if(e.target.name === 'journalDate'){
        setJournalDate(e.target.value)
      }
      else if(e.target.name === 'dueDate'){
        setDueDate(e.target.value)
      }
      else if(e.target.name === 'amount'){
        setAmount(e.target.value)
      }
      else if(e.target.name === 'paidBy'){
        setPaidBy(e.target.value)
      }
      else if(e.target.name === 'city'){
        setCity(e.target.value)
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
        const filteredData = dbPurchaseInvoice.filter(item => item.name === e.target.value);
        if(filteredData.length > 0){
          setFilteredData(filteredData)
          
          setInputList(Array.from({ length: filteredData.length }, () => (
            { id: '', billNo:'' , journalNo, date: journalDate, balance: 0, paid: 0, netBalance: 0 }
          )))
        }
        else{
          setFilteredData([])
        }

        setName(e.target.value)
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

    // JV
    const submit = async(e)=>{
      e.preventDefault()
      
      inputList.forEach(item => {
        item.date = journalDate;
      });

      // fetch the data from form to makes a file in local system
      const data = { userEmail, phoneNo, email, fromAccount:paidBy, city, reference, paidBy, amount:totalPaid, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, path:'PaymentVoucher' };

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

      const data = { selectedIds , path: 'PaymentVoucher' };
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

      const data = { id, path: 'PaymentVoucher' };
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
        const dbDueDate = moment(response.data.dueDate).utc().format('YYYY-MM-DD')
        
        setId(response.data._id)
        setFilteredData(response.data.inputList)
        setJournalDate(dbJournalDate)
        setJournalNo(response.data.journalNo)
        setInputList(response.data.inputList)
        setMemo(response.data.memo)
        setName(response.data.name)
        setReference(response.data.reference)
        setAttachment(response.data.attachment.data)
        setPhoneNo(response.data.phoneNo)
        setName(response.data.name)
        setEmail(response.data.email)
        setCity(response.data.city)
        setAmount(response.data.amount)
        setPaidBy(response.data.paidBy)
        setDueDate(dbDueDate)
      }
    }

    const change = (e, index, id, balance, prevPaid, billNo) => {

      const values = [...inputList];
      values[index][e.target.name] = e.target.value;
      const paidNow = parseInt(e.target.value);
    
      const netBalance = parseInt(balance - (prevPaid + paidNow));

      if(balance){
        values[index].balance = balance;
        values[index].netBalance = netBalance;
        values[index].id = id;
        values[index].billNo = billNo;
      }
      setInputList(values);


      var totalBal = 0;
      var totalPaid = 0;
      var totalNetBalance = 0;
      for (let index = 0; index < inputList.length; index++) {
        totalBal += parseInt(inputList[index].balance ? inputList[index].balance : 0);
        totalPaid += parseInt(inputList[index].paid ? inputList[index].paid : 0);
        totalNetBalance += parseInt(inputList[index].netBalance ? inputList[index].netBalance : 0);
      }
      setTotalBalance(totalBal)
      setTotalPaid(totalPaid)
      setTotalNetBalance(totalNetBalance)
    }

    const newStateSettings = ()=>{

      setOpen(true)
      setId('')
      setJournalDate(today)

      const invoiceNumber = (filteredInvoices.length + 1).toString().padStart(4, '0');
      const formattedInvoice = `PV-${invoiceNumber}`;
      setJournalNo(formattedInvoice)
      
      setMemo('')
      setFilteredData([])
      setAttachment('')
      setPhoneNo(0)
      setName('')
      setPaidBy('')
      setEmail('')
      setReference('')
      setCity('')
      setAmount('')
      setPaidBy('')
      setDueDate('')
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
          <div className="px-4 sm:px-0 flex justify-between">
            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('paymentVoucherTitle')}</h3>
            <button
              type='button'
              onClick={newStateSettings}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              {t('new')}
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
                {t('delete')}
              <AiOutlineDelete className='text-lg ml-2'/>
            </button>

            <ReactToPrint
              trigger={()=>{
                return <button 
                  type='button'
                  className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                  {t('printAll')}
                  <AiOutlinePrinter className='text-lg ml-2'/>
                </button>
              }}
              content={() => componentRef.current}
              documentTitle={`${userEmail} - Payment Vouchers`}
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
                          {t('voucherNo')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('date')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('name')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('totalPaid')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('paidBy')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('view')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((item, index)=>{
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
                        <div className='text-sm font-bold'>{item.totalPaid}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm font-bold'>{item.paidBy}</div>
                      </td>
                      <td className="flex items-center px-3 mr-5 py-4 space-x-4 rtl:space-x-reverse">
                        <button type='button' onClick={()=>{getData(item._id)}} 
                            className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                            <AiOutlineEdit className='text-lg'/>
                          </button>
                      </td>
                          
                    </tr>})}
                    
                  </tbody>
                </table>
                { filteredInvoices.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
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
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={submit}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div ref={speceficComponentRef} className="bg-white px-4 py-5 sm:p-6">

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                            <div className="w-full">
                              <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700">
                              {t('journalDate')}
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="journalDate"
                                id="journalDate"
                                value={journalDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="journalNo" className="block text-sm font-medium text-gray-700">
                                {t('journalNo')}
                              </label>
                              <input
                                type="text"
                                name="journalNo"
                                value={journalNo}
                                id="journalNo"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                            <div className="w-full">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {t('name')}
                              </label>
                              <select id="name" name="name" onChange={ handleChange } value={name} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select contacts</option>
                                {filteredContacts.map((item, index)=>{
                                  return <option key={index} value={item.name}>{item.name} - {item.type}
                                  </option>
                                })}
                              </select>
                            </div>

                            

                            <div className="w-full">
                              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                                {t('phoneNo')}
                              </label>
                              <input
                                type="number"
                                onChange={handleChange}
                                name="phoneNo"
                                value={phoneNo}
                                id="phoneNo"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="w-full">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('email')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="email"
                                value={email}
                                id="email"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                {t('city')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="city"
                                value={city}
                                id="city"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                {t('amount')}
                              </label>
                              <input
                                type="number"
                                name="amount"
                                value={totalPaid}
                                id="amount"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>

                          </div>


                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                        
                            <div className="w-full">
                              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">
                                {t('paidBy')}
                              </label>
                              
                              <select id="paidBy" name="paidBy" onChange={ handleChange } value={paidBy} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select paid By</option>
                                {filteredCharts.map((item, index)=>{
                                  return <option key={index} value={item.accountName}>{item.accountName}</option>
                                })}
                              </select>
                            </div>

                            

                            <div className="w-1/2">
                              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                {t('dueDate')}
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="dueDate"
                                id="dueDate"
                                value={dueDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>


                            <div className="w-1/3">
                              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                                {t('reference')}
                              </label>
                              <input
                                type="text"
                                name="reference"
                                value={reference}
                                onChange={handleChange}
                                id="reference"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          
                          <div className='space-x-4 rtl:space-x-reverse my-10'>
                            <table className="w-full text-sm text-left text-gray-500 ">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                  <th scope="col" className="p-2">
                                      {t('billNo')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('date')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('balance')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('prevPaid')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('remaining')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('paid')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('netBalance')}
                                  </th>
                                </tr>
                              </thead>
                            
                              <tbody>
                              {filteredData.map(( item , index)=>{

                                return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                                  <td className="p-2 w-1/5">
                                    {item.billNo ? item.billNo : 'Undefined'}
                                  </td>
                                  <td className="p-2">
                                    {moment(item.dueDate).format('D MMM YYYY')}
                                  </td>
                                  <td className="p-2">
                                    {item.balance ? item.balance.toLocaleString(): item.totalAmount.toLocaleString()}
                                  </td>
                                  <td className="p-2 text-center">
                                    {item.balance ? '' : item.amountPaid ? item.amountPaid.toLocaleString(): 0}
                                  </td>
                                  <td className="p-2 text-center">
                                    {item.balance ? '' : (item.totalAmount - item.amountPaid).toLocaleString()}
                                  </td>
                                  <td className="p-2 w-1/6">
                                    <input
                                      type="number"
                                      value={ item.paid }
                                      onChange={e=> change(e, index, item._id, item.totalAmount, item.amountPaid, item.billNo)}
                                      name="paid"
                                      id="paid"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      value={ item.balance ? '' : inputList && inputList[index].netBalance }
                                      name="netBalance"
                                      id="netBalance"
                                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      readOnly
                                    />
                                  </td>

                                </tr>})}

                              </tbody>
                            </table>
                            { filteredData.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                          </div>
                        
                          <div className='bg-gray-100'>
                            <div className='flex ml-auto mr-10 space-y-2 space-x-5 rtl:space-x-reverse items-center w-3/5 py-3 mt-20'>
                              <div className="flex flex-col items-center">
                                <label htmlFor="totalBalance" className="block w-full text-sm font-medium text-gray-700">
                                  {t('totalBalance')}
                                </label>
                                <input
                                  type="number"
                                  value = { totalBalance }
                                  name="totalBalance"
                                  id="totalBalance"
                                  className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <label htmlFor="totalPaid" className="block w-full text-sm font-medium text-gray-700">
                                  {t('totalPaid')}
                                </label>
                                <input
                                  type="number"
                                  value = { totalPaid }
                                  name="totalPaid"
                                  id="totalPaid"
                                  className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <label htmlFor="totalNetBalance" className="block w-full text-sm font-medium text-gray-700">
                                  {t('totalNetBalance')}
                                </label>
                                <input
                                  type="number"
                                  value = { totalNetBalance }
                                  name="totalNetBalance"
                                  id="totalNetBalance"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              
                            </div>
                          </div>

                          <div className=" mt-14">
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                              {t('memo')}
                            </label>
                            <textarea cols="30" rows="4" type="text"
                                name="memo"
                                onChange={handleChange}
                                id="memo"
                                value={memo}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                multiple
                            />
                          </div> */}

                        </div>
                        <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">

                        <ReactToPrint
                            trigger={()=>{
                              return <button 
                                type="button"
                                className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                {t('print')}
                                <AiOutlinePrinter className='text-lg ml-2'/>
                              </button>
                            }}
                            content={() => speceficComponentRef.current}
                            documentTitle={`${userEmail} - Payment Voucher`}
                            pageStyle='print'
                          />

                          <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>
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
  let dbVouchers = await dbPaymentVoucher.find()
  let dbContacts = await Contact.find()
  let dbEmployees = await Employees.find()
  let dbAccounts = await Charts.find()
  let dbPaymentMethod = await PaymentType.find()

  let dbPurchaseInvoice = await PurchaseInvoice.find({billStatus: 'unpaid'})

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)), 
      dbAccounts: JSON.parse(JSON.stringify(dbAccounts)),
      dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)), 
      dbEmployees: JSON.parse(JSON.stringify(dbEmployees)),
      dbPurchaseInvoice: JSON.parse(JSON.stringify(dbPurchaseInvoice)), 
    }
  }
}   
export default PaymentVoucher