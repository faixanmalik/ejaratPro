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
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Select, 
  Option,
  IconButton
} from "@material-tailwind/react";


import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import Buildings from 'models/Buildings';
import { useRouter } from 'next/router';
import ContractAndTenant from 'models/ContractAndTenant';
import { MdAccountBox } from 'react-icons/md';
import SalesInvoice from 'models/SalesInvoice';
import ReceiptVoucher from 'models/ReceiptVoucher';




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

  const Cheques = ({ dbSalesInvoice, dbReceipts, dbContacts, dbBuildings, dbTenants }) => {
    
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [openNewContract, setOpenNewContract] = useState(false)

    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

		const [search, setSearch] = useState('')
		const [totalNoOfPages, setTotalNoOfPages] = useState(1)
		const [active, setActive] = useState(1);
		const pageSize = 10;


    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)
    const [isChecked, setIsChecked] = useState(false);
		const [filteredData, setFilteredData] = useState([])


    function handleRowCheckboxChange(e, id) {

      const isChecked = selectedIds.includes(id);

      if (isChecked) {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }

    useEffect(() => {
      if(selectedIds.length > 0) {
        setIsChecked(true);
      }
      else{
        setIsChecked(false);
      }
      
    }, [selectedIds])
    

    useEffect(() => {
      setContacts(dbContacts)

      let filteredSalesInvoices = dbSalesInvoice.filter((item)=>{
        return item.receivedBy === 'Cheque'
      })

			let filteredReceipts = dbReceipts.map((item) => {
				let newItem = { ...item };
				newItem.inputList = newItem.inputList.filter((input) => input.paidBy === 'Cheque');
				return newItem;
			});

			let concatination = filteredSalesInvoices.concat(filteredReceipts)

			if (concatination.length > 0) {
				setFilteredData(concatination);
			}

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }

    }, [dbSalesInvoice, dbReceipts])

    useEffect(() => {
      
    //   const newFilteredData = dbVouchers.filter((item)=>{
    //     return item.buildingNameInEnglish.toLowerCase().includes(search.toLowerCase());
    //   });
    //   setFilteredData(newFilteredData)

    }, [search])
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'search') {
        setSearch(value);
      } 
    }

    const delEntry = async()=>{

      const data = { selectedIds , path: 'Cheques' };
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

    const getData = async (id) => {
      setIsOpenSaveChange(false);
    
      const data = { id, path: 'Cheques' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      let response = await res.json();
    
      if (response.success === true) {
        const { unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof, balcony, size, electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city, area, notes, tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber, newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes,} = response.data;
    
        let dbTenantExpIdNumber = moment(tenantExpIdNumber, 'YYYY-MM-DD', true).isValid()
          ? moment(tenantExpIdNumber).utc().format('YYYY-MM-DD')
          : '';
        let dbTenantExpPassPort = moment(tenantExpPassPort, 'YYYY-MM-DD', true).isValid()
          ? moment(tenantExpPassPort).utc().format('YYYY-MM-DD')
          : '';
        let dbNewContractStartDate = moment(newContractStartDate, 'YYYY-MM-DD', true).isValid()
          ? moment(newContractStartDate).utc().format('YYYY-MM-DD')
          : '';
        let dbNewContractEndDate = moment(newContractEndDate, 'YYYY-MM-DD', true).isValid()
          ? moment(newContractEndDate).utc().format('YYYY-MM-DD')
          : '';
    
        setTenantExpPassPort(dbTenantExpPassPort);
        setTenantExpIdNumber(dbTenantExpIdNumber);
        setNewContractStartDate(dbNewContractStartDate);
        setNewContractEndDate(dbNewContractEndDate);
    
        setId(response.data._id);
        setUnitNo(unitNo || '');
        setBuildingNameInArabic(buildingNameInArabic || '');
        setBuildingNameInEnglish(buildingNameInEnglish || '');
        setPlotNo(plotNo || '');
        setRent(rent || '');
        setBathroom(bathroom || '');
        setParkings(parkings || '');
        setRentParking(rentParking || '');
        setRoof(roof || '');
        setBalcony(balcony || '');
        setSize(size || '');
        setElectricityMeterNo(electricityMeterNo || '');
        setWaterMeterNumber(waterMeterNumber || '');
        setSewageNumber(sewageNumber || '');
        setAc(ac || '');
        setUnitType(unitType || '');
        setUnitUse(unitUse || '');
        setUnitStatus(unitStatus || '');
        setView(view || '');
        setCountry(country || '');
        setCity(city || '');
        setArea(area || '');
        setNotes(notes || '');
    
        setTenant(tenantName || '');
        setTenantName(tenantName || '');
        setTenantEmail(tenantEmail || '');
        setTenantPhoneNo(tenantPhoneNo || '');
        setTenantOpeningBalance(tenantOpeningBalance || '');
        setTenantPassPortNumber(tenantPassPortNumber || '');
        setTenantVatRegistrationNo(tenantVatRegistrationNo || '');
        setTenantIbanNo(tenantIbanNo || '');
        setTenantBank(tenantBank || '');
        setTenantBankAccountNumber(tenantBankAccountNumber || '');
        setTenantIdNumber(tenantIdNumber || '');
    
        setNewContractUnitRent(newContractUnitRent || '');
        setNewContractCommission(newContractCommission || '');
        setNewContractRentParking(newContractRentParking || '');
        setNewContractBouncedChequeFine(newContractBouncedChequeFine || '');
        setNewContractStatus(newContractStatus || '');
        setNewContractPaymentScheduling(newContractPaymentScheduling || '');
        setNewContractSecurityDeposit(newContractSecurityDeposit || '');
        setNewContractNotes(newContractNotes || '');
    
        // Now, return the data you want to use in the calling function
        return {
          tenantName: tenantName || '',
          unitRent: newContractUnitRent || 0,
          commission: newContractCommission || 0,
          parkingRent: newContractRentParking || 0,
          securityDeposit: newContractSecurityDeposit || 0,
        };
      }
    }


    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();


    const next = () => {
      if (active === 10) return;
      setActive(active + 1);
    };
     
    const prev = () => {
      if (active === 1) return;
      setActive(active - 1);
    };


		useEffect(() => {
			// Calculate the total number of pages and update the state
			const totalNoOfPages = Math.ceil(filteredData.length / pageSize);
			setTotalNoOfPages(totalNoOfPages);
		}, [filteredData]);

		useEffect(() => {
			const startIndex = (active - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const currentItems = filteredData.slice(startIndex, endIndex);
	
			if (currentItems.length > 0) {
				setFilteredData(currentItems);
			}
		}, [active]);


    
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Cheques</h3>
            </div>
          </div>
          <div className="mt-2 md:col-span-2 md:mt-0">

            <div className='flex justify-between'>

              <div className='w-1/4'>

                <div className="relative rounded-lg bg-gray-50 border-2 border-blue-800">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <div className='pl-8'>
                    <input value={search} onChange={handleChange} type="text" id="search" name='search' className="block w-full p-2 text-sm text-gray-900 rounded-lg bg-gray-50 outline-none placeholder:text-gray-500" placeholder="Search Contract..." required/>
                  </div>
                </div>
              </div>

              <div className='flex'>
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
                  documentTitle='Units'
                  pageStyle='print'
                />

              </div>
            </div>

            {isChecked === true ? <div className='flex justify-end my-2'>
              <button onClick={(e)=>newContract(e, true)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Renewal Contract
              </button>
              <button onClick={(e)=>issueInvoice(e)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Issue Invoice
              </button>
              <button onClick={(e)=>collectPayment(e)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Collect Payment
              </button>
              <button onClick={delEntry} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Send Reminder
              </button>
              <button onClick={delEntry} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Terminate Contract
              </button>

              <button onClick={delEntry} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-red-800 flex hover:text-white border-2 border-red-800 hover:bg-red-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Delete
                <AiOutlineDelete className='text-lg ml-2'/>
              </button>
              
            </div>: ''}

            <form method="POST">
              <div className="overflow-hidden shadow sm:rounded-md">
                
                <div className="mt-2 overflow-x-auto shadow-sm">
                  <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-[11px] text-gray-700 uppercase bg-[#e9ecf7]">
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
														Chq No
												</th>
												<th scope="col" className="p-1">
														Due Date
												</th>
												<th scope="col" className="p-1">
														Amount
												</th> 
												<th scope="col" className="p-1">
													View
												</th>
											</tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index)=>{
                        console.log(item)
                      return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
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
													<div className='text-sm'>#{item.chqNo || item.inputList[0].ref}</div>
												</td>
												<td className="p-1">
													<div className='text-sm'>{item.type === 'ReceiptVoucher' 
                          ? moment(item.inputList[0].chequeDueDate).utc().format('D MMM YYYY') 
                          : moment(item.dueDate).utc().format('D MMM YYYY')}</div>
												</td>
												<td className="p-1">
													<div className='text-sm font-semibold'>{item.totalPaid || item.totalAmount}</div>
												</td>
                        <td className="flex items-center py-4 space-x-4">
                          <button type='button' onClick={(e)=>{getData(item._id), setOpenNewContract(e, true)}} 
                            className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                            <AiOutlineEdit className='text-lg'/>
                          </button>
                        </td>
                      </tr>})}
                      
                    </tbody>
                  </table>
                  { filteredData.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                </div>

              </div>
            </form>
          </div>
        </div>


        {/* Pagination */}
        <div className="flex items-center gap-8 justify-end mr-10">
          <IconButton
            size="sm"
            variant="outlined"
            onClick={prev}
            disabled={active === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <Typography color="gray" className="font-normal pt-4">
              Page <strong className="text-gray-900">{active}</strong> of{" "}
              <strong className="text-gray-900">{totalNoOfPages}</strong>
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={next}
            disabled={active === totalNoOfPages}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

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
  let dbSalesInvoice = await SalesInvoice.find()
  let dbReceipts = await ReceiptVoucher.find()

  let dbBuildings = await Buildings.find()
  let dbContacts = await Contact.find()
  let dbTenants = await Contact.find({'type': 'Tenant'})



  // Pass data to the page via props
  return {
    props: {
        dbSalesInvoice: JSON.parse(JSON.stringify(dbSalesInvoice)),
        dbReceipts: JSON.parse(JSON.stringify(dbReceipts)),

        dbContacts: JSON.parse(JSON.stringify(dbContacts)),
        dbTenants: JSON.parse(JSON.stringify(dbTenants)),
        dbBuildings: JSON.parse(JSON.stringify(dbBuildings)),
    }
  }
}   
export default Cheques;