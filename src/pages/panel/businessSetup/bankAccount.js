import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Bank from 'models/BankAccount';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { BiExport, BiImport } from 'react-icons/bi';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {XLSX, read, utils} from 'xlsx';
import useTranslation from 'next-translate/useTranslation';


const BankAccount = ({dbBankAccount, charts, userEmail}) => {


  const [open, setOpen] = useState(false)

  const { t } = useTranslation('businessSetup')

  // Add accountTitles
  const [bankBranch, setBankBranch] = useState('')
  const [accountTitle, setAccountTitle] = useState('')
  const [accountNo, setAccountNo] = useState('')
  const [accountDesc, setAccountDesc] = useState('')
  const [accountType, setAccountType] = useState('')
  const [borrowingLimit, setBorrowingLimit] = useState('')
  const [chartsOfAccount, setChartsOfAccount] = useState('')

  
  // id For delete contact
  const [id, setId] = useState('')
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [filteredCharts, setFilteredCharts] = useState([])

  const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)

  // authentications
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if(myUser.department === 'Admin'){
      setIsAdmin(true)
    }
    let filteredInvoices = dbBankAccount.filter((item)=>{
      return item.userEmail === userEmail;
    })
    setFilteredInvoices(filteredInvoices)

    let filteredCharts = charts.filter((item)=>{
      return item.userEmail === userEmail;
    })
    setFilteredCharts(filteredCharts)
  }, [userEmail]);

  
  function handleRowCheckboxChange(e, id) {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(rowId => rowId !== id));
    }
  }

  const tableRef = useRef(null);
  const hiddenFileInput = React.useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = read(binaryData,{type:'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = utils.sheet_to_json(worksheet, {header: 1});

      const header = ['sr','bankBranch', 'accountTitle', 'accountNo', 'accountType' , 'chartsOfAccount']

      const heads = header.map((head, index) => ({ title: head, entry: head, key: index }));

      parsedData.splice(0,1)
      convertToJson(header, parsedData)
    };
    reader.readAsBinaryString(file);
  }

  const convertToJson = (header, data)=>{
    const row = [];
    data.forEach(element => {
      const rowData = {};
      element.forEach((element, index) => {
        rowData[header[index]] = element;
      });
      row.push(rowData);
    });
    importEntries(row)
  }

  const importEntries = async(row)=>{
    const data = { row, path:'bankAccount', importEntries:'importEntries' };
      let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      if(response.success === true){
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
  }
  
  const handleChange = (e) => {
    if(e.target.name === 'bankBranch'){
      setBankBranch(e.target.value)
    }
    else if(e.target.name === 'accountNo'){
      setAccountNo(e.target.value)
    }
    else if(e.target.name === 'accountType'){
      setAccountType(e.target.value)
    }
    else if(e.target.name === 'accountDesc'){
      setAccountDesc(e.target.value)
    }
    else if(e.target.name === 'accountTitle'){
      setAccountTitle(e.target.value)
    }
    else if(e.target.name === 'chartsOfAccount'){
      setChartsOfAccount(e.target.value)
    }
    else if(e.target.name === 'borrowingLimit'){
      setBorrowingLimit(e.target.value)
    }
  }

  const editEntry = async(id)=>{
    setOpen(true)

    const data = { id,  bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit,  path: 'bankAccount'};
    
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

    const data = { selectedIds , path: 'bankAccount' };
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
    setIsOpenSaveChange(false);

    const data = { id, path: 'bankAccount' };
    let res = await fetch(`/api/getDataEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      if (response.success === true){
        setId(response.bankAccount._id)
        setBankBranch(response.bankAccount.bankBranch)
        setAccountNo(response.bankAccount.accountNo)
        setAccountType(response.bankAccount.accountType)
        setAccountDesc(response.bankAccount.accountDesc)
        setAccountTitle(response.bankAccount.accountTitle)
        setChartsOfAccount(response.bankAccount.chartsOfAccount)
        setBorrowingLimit(response.bankAccount.borrowingLimit)
      }
      else {
      toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
    }
  }

  const submit = async(e)=>{
    e.preventDefault()
    
    // fetch the data from form to makes a file in local system
    const data = { userEmail, bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit, path:'bankAccount' };
    
      let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      if(response.success === true){
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
  }


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
            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('bankAccountTitle')}</h3>
            <button onClick={()=>{ 
              setOpen(true), 
              setBankBranch(''), 
              setAccountNo(''), 
              setAccountType(''), 
              setAccountDesc(''), 
              setAccountTitle(''), 
              setChartsOfAccount(''), 
              setBorrowingLimit(''),
              setIsOpenSaveChange(true)
            }} 
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
               {t('new')}
            </button>
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">


          <div className='flex items-center space-x-2 rtl:space-x-reverse mb-1'>
            <div>
              <DownloadTableExcel
                filename="Bank Account"
                sheet="Bank Account"
                currentTableRef={tableRef.current}>
                <button type="button" className="text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2">
                {t('export')}
                  <BiExport className='text-lg ml-2'/>
                </button>

              </DownloadTableExcel>
            </div>
            <div className=''>
              <button type="button" onClick={handleClick} 
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                  {t('import')}
                <BiImport className='text-lg ml-2'/>
              </button>
              <input type="file"
                ref={hiddenFileInput}
                onChange={handleFileChange}
                style={{display:'none'}} 
              /> 
            </div>
            <div className=''>
              <button button type="button" onClick={delEntry}
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
                >
                {t('delete')}
                <AiOutlineDelete className='text-lg ml-2'/>
              </button>
            </div>
          </div>

          <form method="POST">
            <div className="overflow-hidden shadow sm:rounded-md">
            <div className="overflow-x-auto shadow-sm">
              <table className="w-full text-sm text-left text-gray-500" ref={tableRef}>
                <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">
                        {t('sr')}
                    </th>
                    <th scope="col" className="px-2 py-3">
                        {t('branchName')}
                    </th>
                    <th scope="col" className="px-2 py-3">
                        {t('accountTitle')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountNumber')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountType')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('chartsOfAccount')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="">{t('viewOrEdit')}</span>
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
                    <td scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {index + 1}
                    </td>
                    <td scope="row" className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {item.bankBranch}
                    </td>
                    <td className="px-2 py-4">
                        {item.accountTitle}
                    </td>
                    <td className="px-6 py-4">
                        {item.accountNo}
                    </td>
                    <td className="px-6 py-4">
                        {item.accountType}
                    </td>
                    <td className="px-6 py-4">
                        {item.chartsOfAccount}
                    </td>
                    <td className="flex items-center px-6 mr-5 py-4 space-x-4 rtl:space-x-reverse">
                      <button type='button' onClick={()=>{getData(item._id)}} 
                        className= {`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline" `} disabled={isAdmin === false}><AiOutlineEdit className='text-lg'/></button>
                    </td>
                  </tr>})}

                </tbody>

              </table>
                {filteredInvoices.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No Bank Account found</h1> : ''}
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
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-3xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  
                  <div className='w-full'>
                    <div className="mt-10 sm:mt-0 w-full">
                      <div className="md:grid md:grid-cols-1 md:gap-6">
                        <div className="md:col-span-1">
                          <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('addBankAccount')}</h3>
                          </div>
                        </div>
                        <div className="mt-2 md:col-span-2 md:mt-0 w-full">
                          <form method="POST" onSubmit={submit}>
                            <div className="overflow-hidden shadow sm:rounded-md">
                              <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">

                                    <div className="col-span-6 sm:col-span-6">
                                      <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700">{t('bankBranch')}</label>
                                      <input onChange={handleChange} value={bankBranch} type="text" name="bankBranch" id="bankBranch" autoComplete="bankBranch" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                                      <label htmlFor="accountTitle" className="block text-sm font-medium text-gray-700">{t('accountTitle')}</label>
                                      <input onChange={handleChange} value={accountTitle} type="text" name="accountTitle" id="accountTitle" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-s requiredm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700">{t('accountNumber')}</label>
                                      <input onChange={handleChange} value={accountNo} type="number" name="accountNo" id="accountNo" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                    </div>

                                    <div className="col-span-6">
                                      <label htmlFor="accountDesc" className="block text-sm font-medium text-gray-700">{t('accountDesc')}</label>
                                      <input onChange={handleChange} value={accountDesc} type="text" name="accountDesc" id="accountDesc" autoComplete="accountDesc" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"  required/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">{t('accountType')}</label>
                                      <select id="accountType" name="accountType" onChange={handleChange} value={accountType} autoComplete="accountType" className="mt-1 py-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        <option>Select Account Type</option>
                                        <option value={'Current'}>Current</option>
                                      </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                                      <label htmlFor="borrowingLimit" className="block text-sm font-medium text-gray-700">{t('borrowingLimit')}</label>
                                      <input onChange={handleChange} value={borrowingLimit} type="number" name="borrowingLimit" id="borrowingLimit" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                    </div>



                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="chartsOfAccounts" className="block text-sm font-medium text-gray-700">
                                        {t('chartsOfAccount')}
                                      </label>
                                      <select
                                        onChange={handleChange}
                                        value={chartsOfAccount}
                                        id="chartsOfAccount"
                                        name="chartsOfAccount"
                                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                      >
                                        <option>Select Charts of Accounts</option>
                                          {filteredCharts.map((item, index)=>{
                                            return <option key={index} value={item.accountName}>{item.accountCode} - {item.accountName}</option>
                                          })}
                                      </select>
                                    </div>


                                </div>
                              </div>
                              <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">
                                <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                                {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
                            </div>
                            
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div>
                  
                    </div>
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
  let dbBankAccount = await Bank.find()
  let chartsOfAccount = await Charts.find()
  

  // Pass data to the page via props
  return {
     props: { 
      dbBankAccount: JSON.parse(JSON.stringify(dbBankAccount)),
      charts: JSON.parse(JSON.stringify(chartsOfAccount)),
      }
  }
}

export default BankAccount