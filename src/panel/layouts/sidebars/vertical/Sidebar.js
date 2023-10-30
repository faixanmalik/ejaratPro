import { React, Fragment, useState } from 'react'
import Logo from "../../logo/Logo";
import { useRouter } from "next/router";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, MenuItem, SubMenu, Sidebar } from 'react-pro-sidebar';

import {AiOutlineBank, AiOutlineCloseCircle, AiOutlineContacts, AiOutlineFundProjectionScreen, AiOutlineProject, AiOutlineSetting, AiOutlineShoppingCart, AiOutlineTeam, AiOutlineTransaction, AiOutlineUser, AiOutlineUserSwitch } from 'react-icons/ai'
import { BiFingerprint, BiHomeAlt, BiLocationPlus, BiPurchaseTagAlt, BiUserCheck, BiUserCircle } from 'react-icons/bi'
import {MdOutlineInventory2, MdOutlineRealEstateAgent, MdPayment, MdProductionQuantityLimits} from 'react-icons/md'
import {IoPieChartSharp, IoBusinessOutline} from 'react-icons/io5'
import {HiOutlineCash, HiOutlineDocumentReport, HiOutlineReceiptTax} from 'react-icons/hi'
import {HiOutlineBanknotes} from 'react-icons/hi2'

import {BsBank, BsChatQuote, BsShop} from 'react-icons/bs'
import {FiShoppingBag, FiUserPlus, FiUsers} from 'react-icons/fi'
import {FaFileContract, FaRegBuilding, FaToriiGate} from 'react-icons/fa'
import {TbFileInvoice} from 'react-icons/tb'
import {RiBankCardLine, RiBankLine, RiBillLine, RiCommunityLine} from 'react-icons/ri'
import {SlCalender} from 'react-icons/sl'
import { Link } from 'react-feather';





const Sidebar2 = ({ showMobilemenu }) => {

    
  const router = useRouter();
  const location = router.pathname;
  const [open, setOpen] = useState(false)

  
  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <button className="text-2xl ml-6 items-center lg:hidden" onClick={showMobilemenu} >
          <AiOutlineCloseCircle />
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">

                  <div className="relative mt-6 w-full overflow-x-auto shadow-sm">
                    <table className="w-full text-sm text-left text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Business Setup
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Purchase Invoice
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Sales Invoice
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Reports
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/chartsOfAccount'} className='no-underline text-gray-500 font-medium text-base'>Charts of Accounts</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/purchaseInvoice'} className='no-underline text-gray-500 font-medium text-base'>Purchase Invoice</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/salesInvoice'} className='no-underline text-gray-500 font-medium text-base'>Sales Invoice</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/generalLedger'} className='no-underline text-gray-500 font-medium text-base'>General Ledger</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/taxRate'} className='no-underline text-gray-500 font-medium text-base'>Tax Rate</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/paymentVoucher'} className='no-underline text-gray-500 font-medium text-base'>Payment Voucher</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/creditSalesInvoice'} className='no-underline text-gray-500 font-medium text-base'>Credit Sales Invoice</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/trialBalance'} className='no-underline text-gray-500 font-medium text-base'>Trial Balance</a>
                          </td>
                        </tr>


                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/contactList'} className='no-underline text-gray-500 font-medium text-base'>Contact List</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/debitNote'} className='no-underline text-gray-500 font-medium text-base'>Debit Note</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/receiptVoucher'} className='no-underline text-gray-500 font-medium text-base'>Receipt Voucher</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/profitAndLoss'} className='no-underline text-gray-500 font-medium text-base'>Profit and Loss</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/productAndServices'} className='no-underline text-gray-500 font-medium text-base'>Product and Services</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/expenses'} className='no-underline text-gray-500 font-medium text-base'>Expenses</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/creditNote'} className='no-underline text-gray-500 font-medium text-base'>Credit Note</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/balanceSheet'} className='no-underline text-gray-500 font-medium text-base'>Balance Sheet</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/bankAccount'} className='no-underline text-gray-500 font-medium text-base'>Bank Account</a>
                          </td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/journalVoucher'} className='no-underline text-gray-500 font-medium text-base'>Journal Voucher</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/contactTransactionSummary'} className='no-underline text-gray-500 font-medium text-base'>Contact Transaction</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/paymentMethod'} className='no-underline text-gray-500 font-medium text-base'>Payment Method</a>
                          </td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="pt-4 mt-2">

      <Sidebar width='255px' className='-ml-3'>
      <Menu className='bg-white'>
        <div className='justify-center flex mb-3'>
          <button onClick={() => { setOpen(true) }} className='bg-blue-800 hover:bg-blue-900 mb-2 font-medium text-white px-24 py-2 rounded-lg'>New</button>
        </div>
        
        <Menu>
          <MenuItem icon={<BiHomeAlt className='text-lg'/>} className={ location === '/panel' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'} href="/panel" >
            Dashboard
          </MenuItem>
    
          <SubMenu label="Real Estate" icon={<MdOutlineRealEstateAgent className='text-lg'/>}>
            <MenuItem href="/panel/realEstate/buildings" icon={<FaRegBuilding className='text-lg'/>} className={ location === '/panel/realEstate/buildings' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Buildings and Owner
            </MenuItem>
            <MenuItem href="/panel/realEstate/units" icon={<RiCommunityLine className='text-lg'/>} className={ location === '/panel/realEstate/units' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Units
            </MenuItem>
            <MenuItem href="/panel/realEstate/contractAndTenants" icon={<FaFileContract className='text-lg'/>} className={ location === '/panel/realEstate/contractAndTenants' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Contract And Tenants
            </MenuItem>
            <MenuItem href="/panel/realEstate/cheques" icon={<HiOutlineBanknotes className='text-lg'/>} className={ location === '/panel/realEstate/cheques' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Funds Management
            </MenuItem>
            <MenuItem href="/panel/realEstate/chequeTransactions" icon={<AiOutlineTransaction className='text-lg'/>} className={ location === '/panel/realEstate/chequeTransactions' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Cheque Trx
            </MenuItem>
          </SubMenu>

          <SubMenu label="User Managment" icon={<AiOutlineUser className='text-lg'/>}>
            <MenuItem href="/panel/userManagment/addRole" icon={<BiUserCheck className='text-lg'/>} className={ location === '/panel/userManagment/addRole' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Add Role
            </MenuItem>
            {/*<MenuItem href="/panel/userManagment/userRights" icon={<BiUserCheck className='text-lg'/>} className={ location === '/panel/userManagment/userRights' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              User Rights
            </MenuItem>*/}
          </SubMenu>

          <SubMenu label="Business Setup" icon={<IoBusinessOutline className='text-lg'/>}>
            <MenuItem href="/panel/businessSetup/chartsOfAccount" icon={<IoPieChartSharp className='text-lg'/>} className={ location === '/panel/businessSetup/chartsOfAccount' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Charts of Accounts
            </MenuItem>
            <MenuItem href="/panel/businessSetup/taxRate" icon={<HiOutlineReceiptTax className='text-lg'/>} className={ location === '/panel/businessSetup/taxRate' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Tax Rate
            </MenuItem>
            <MenuItem href="/panel/businessSetup/contactList" icon={<AiOutlineContacts className='text-lg'/>} className={ location === '/panel/businessSetup/contactList' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Contact List
            </MenuItem>
            <MenuItem href="/panel/businessSetup/productAndServices" icon={<MdProductionQuantityLimits className='text-lg'/>} className={ location === '/panel/businessSetup/productAndServices' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Product and Services
            </MenuItem>
            <MenuItem href="/panel/businessSetup/bankAccount" icon={<BsBank className='text-lg'/>} className={ location === '/panel/businessSetup/bankAccounts' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Bank Accounts
            </MenuItem>
          </SubMenu>


          <SubMenu label="Purchase Module" icon={<RiBankCardLine className='text-lg'/>}>

            <MenuItem href="/panel/purchaseModule/purchaseInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/purchaseOrder' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Purchase Invoice
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/debitNote" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/debitNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Debit Note
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/expenses" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/expenses' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Expenses
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/paymentVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/paymentVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Payment voucher
            </MenuItem>

          </SubMenu>

          <SubMenu label="Sales Module" icon={<RiBankCardLine className='text-lg'/>}>

            <MenuItem href="/panel/salesModule/salesInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/salesInvoice' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Sales Invoice
            </MenuItem>
            <MenuItem href="/panel/salesModule/creditSaleInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/purchaseOrder' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Credit Sales Invoice
            </MenuItem>
            <MenuItem href="/panel/salesModule/creditNote" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/creditNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Credit Note
            </MenuItem>
            <MenuItem href="/panel/salesModule/receiptVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/receiptVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Receipt Voucher
            </MenuItem>
            <MenuItem href="/panel/salesModule/journalVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/journalVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Journal Voucher
            </MenuItem>
          </SubMenu>

          <SubMenu label="Payroll" icon={<FiUserPlus className='text-lg'/>}>
            <MenuItem href="/panel/payroll/employees" icon={<FiUsers className='text-lg'/>} className={ location === '/panel/payroll/employees' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Employees
            </MenuItem>
          </SubMenu>
          
          <SubMenu label="Reports" icon={<HiOutlineDocumentReport className='text-lg'/>}>
            <MenuItem href="/panel/financialManagment/reports/generalLedger" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/generalLedger' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              General Ledger
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/trialBalance" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/trialBalance' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Trial Balance
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/profitAndLoss" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/profitAndLoss' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Profit And Loss
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/balanceSheet" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/balanceSheet' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Balance Sheet
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/contactTransactionSummary" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/contactTransactionSummary' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Contact Transaction
            </MenuItem>
          </SubMenu>


          <SubMenu label="Settings" icon={<AiOutlineSetting className='text-lg'/>}>
            <MenuItem href="/panel/settings/paymentMethod" icon={<MdPayment className='text-lg'/>} className={ location === '/panel/settings/paymentMethod' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Payment Method
            </MenuItem>
            <MenuItem href="/panel/settings/project" icon={<AiOutlineProject className='text-lg'/>} className={ location === '/panel/settings/project' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Project
            </MenuItem>
            <MenuItem href="/panel/settings/location" icon={<BiLocationPlus className='text-lg'/>} className={ location === '/panel/settings/location' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Location
            </MenuItem>
            
          </SubMenu>
          
        </Menu>
      </Menu>
      </Sidebar>


      </div>
    </div>
  );
};



export default Sidebar2;
