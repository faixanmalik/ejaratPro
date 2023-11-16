// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import BankAccount from 'models/BankAccount';
import Charts from 'models/Charts';
import Contact from 'models/Contact';
import Employees from 'models/Employees';
import Product from 'models/Product';
import Role from 'models/Role';
import PurchaseInvoice from 'models/PurchaseInvoice';
import TaxRate from 'models/TaxRate';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import SalesInvoice from 'models/SalesInvoice';
import Expenses from 'models/Expenses';
import PaymentVoucher from 'models/PaymentVoucher';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentMethod from 'models/PaymentMethod';
import JournalVoucher from 'models/JournalVoucher';
import Buildings from 'models/Buildings';
import Units from 'models/Units';
import ContractAndTenant from 'models/ContractAndTenant';
import Cheque from 'models/Cheque';
import ChequeTransaction from 'models/ChequeTransaction';


export default async function handler(req, res) {

    if (req.method == 'POST'){
        const { path } = req.body;

        if( path === 'employees'){
          const { name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip, row, importEntries  } = req.body;
          if(importEntries){
            await Employees.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added!" }) 
          }
          else{
            let newEntry = new Employees( { name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
          }

        }
        else if( path === 'chartsOfAccounts'){
          const { accountCode, accountName, account, balance , asof, desc, subAccount, row, importEntries  } = req.body;

          let dbChart = await Charts.findOne({accountCode})
          if(dbChart){
            res.status(400).json({ success: false, message: "Already Found!" }) 
          }
          else{
            if(importEntries){
              await Charts.insertMany(row);
              res.status(200).json({ success: true, message: "Entry Added!" }) 
            }
            else{

              let newCharts = new Charts( { account, accountCode, accountName, balance , asof, desc, subAccount } );
              await newCharts.save();
              res.status(200).json({ success: true, message: "Entry Added!" }) 
            }
          }
        }
        else if( path === 'bankAccount'){
          const { bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit, importEntries, row } = req.body;

          if(importEntries){
            await BankAccount.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newBankAccount = new BankAccount( { bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit } );
            await newBankAccount.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
        }
        else if( path === 'contactList'){
          const { name, type, accounts, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date, row, importEntries } = req.body;

          if(importEntries){
            await Contact.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newContact = new Contact( { name, type, accounts, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date } );
            await newContact.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
        }
        else if( path === 'productAndServices'){
          const { code, name, linkAccount, desc, row, importEntries  } = req.body;

          if(importEntries){
            Product.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newProduct = new Product( { code, name, linkAccount, desc  } );
            await newProduct.save();
            res.status(200).json({ success: true, message: "Entry Added !"}) 
          }
        }
        else if( path === 'addRole'){
          const { roleName, roleDesc } = req.body;
          
          let newEntry = new Role( { roleName, roleDesc } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        else if( path === 'PaymentMethod'){
          const { paymentType, chartsOfAccount } = req.body;
          
          let newEntry = new PaymentMethod( { paymentType, chartsOfAccount } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        else if( path === 'journalVoucher'){
          const { totalDebit , totalCredit, inputList, name, dec, memo, journalDate, journalNo, attachment, path } = req.body;

          let dbJV = await JournalVoucher.findOne({ journalNo })

          if( dbJV ){
            res.status(400).json({ success: false, message: "Already Found!" }) 
          }
          else{
            let newEntry = new JournalVoucher( { totalDebit , totalCredit, inputList , name, dec , memo, journalDate, journalNo, attachment, path } );
            await newEntry.save();
            
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }   
        }


        // Credit Sales Invoice
        else if( path === 'CreditSalesInvoice'){
          const { contractId, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          if(contractId){
            await ContractAndTenant.findByIdAndUpdate(contractId, { newContractStatus: 'Close', unitStatus:'Available' });
          }
          let newEntry = new CreditSalesInvoice( { contractId, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Purchase Invoice
        else if( path === 'PurchaseInvoice'){
          const { phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          let newEntry = new PurchaseInvoice( { phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        
        // Tax Rate
        else if( path === 'TaxRate'){
          const { name, taxRate, chartsOfAccount } = req.body;
          
          let newEntry = new TaxRate( { name, taxRate, chartsOfAccount } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }

        // Credit Note Invoice
        else if( path === 'CreditNote'){
          const { contractId, phoneNo, email, city, address, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          if(contractId){
            await ContractAndTenant.findByIdAndUpdate(contractId, { newContractStatus: 'Close', unitStatus:'Available' });
          }

          let newEntry = new CreditNote( { contractId, phoneNo, email, city, address, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Debit Note Invoice
        else if( path === 'DebitNote' ){
            const { phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            let newEntry = new DebitNote( { phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        else if( path === 'SalesInvoice'){
          const { phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          try {

            let newChequeEntry = new Cheque( { phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newChequeEntry.save();

            let newEntry = new SalesInvoice( { phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 

          } catch (error) {
            console.log(error);
          }
        }

        // Expenses Invoice
        else if( path === 'Expenses'){
            const { phoneNo, email, city, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            let newEntry = new Expenses( { phoneNo, email, city, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }


        // Payment Voucher Invoice
        else if( path === 'PaymentVoucher'){
            const { phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, path, importEntries, row } = req.body;

        
            for (const newItem of inputList) {
                if(newItem.id){
                  await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: newItem.paid } });
                }
            }
            
            let purchaseInvoices = await PurchaseInvoice.find()

            for (const item of purchaseInvoices) {

                if(item.amountPaid === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                }
                else if(item.amountPaid > item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Advance' });
                }
                else if (item.amountReceived === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                }
                else {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new PaymentVoucher( { phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
    
        // Receipt Voucher Invoice
        else if( path === 'ReceiptVoucher'){
            const { phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, project, attachment, path, importEntries, row } = req.body;

            if (Array.isArray(req.body.inputList)) {
                const filteredInv = {
                    ...req.body,
                    // inputList: req.body.inputList.filter((input) => input.paidBy === 'Cheque'),
                    type: path
                };

                if (filteredInv.inputList.length > 0) {
                    let newEntry = new Cheque(filteredInv);
                    await newEntry.save();
                } else {
                    console.log("inputList is empty, not saving to the database");
                }

            }
            else {
                console.log("The 'inputList' property is not an array or doesn't exist in req.body");
            }


            for (const newItem of inputList) {
                await CreditSalesInvoice.findOneAndUpdate({billNo:newItem.billNo}, { $inc: { amountPaid: newItem.paid } });
            }

            let Invoices = await CreditSalesInvoice.find()
            for (const item of Invoices) {
                if(item.amountPaid === item.totalAmount) {
                    await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                }
                else {
                    await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new ReceiptVoucher( { phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, project, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }


        // Receipt Voucher Invoice
        else if( path === 'Buildings'){
          const { receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email, path, importEntries, row } = req.body;

            for (const unit of receiveUnitsArray) {

              let rent = unit.unitRent;
              const unitDocument = {
                nameInBill:nameInInvoice, name, phoneNo, email, buildingNameInEnglish, expID, idNumber, expPassPort, passPortNumber, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment,
                parkings, roof, rent, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling,
                ...unit
              };
        
              await Units.create(unitDocument);
              console.log('Unit inserted:', unitDocument);
            }

            let newEntry = new Buildings( { receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        else if( path === 'Units'){
            const { attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes, path, importEntries, row } = req.body;

            let newEntry = new Units( { attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        else if( path === 'NewContract'){
            const { unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof,  balcony, size,  electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city,  area,  notes,tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber,newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes, path, importEntries, row } = req.body;

            let newEntry = new ContractAndTenant( { unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof,  balcony, size,  electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city,  area,  notes,tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber,newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        else if( path === 'ChequeTransaction'){
            const { totalDebit , totalCredit, inputList, chequeStatus, chequeId, name, email, desc, memo, journalDate, journalNo, attachment, path } = req.body;

            let data = await ChequeTransaction.findOne({ journalNo })
            if( data ){
                res.status(400).json({ success: false, message: "Already Found!" }) 
            }
            else{
                let newEntry = new ChequeTransaction( { totalDebit , totalCredit, inputList, chequeStatus, chequeId, name, email, desc , memo, journalDate, journalNo, attachment, path } );
                await Cheque.findByIdAndUpdate(chequeId, {chequeStatus: chequeStatus})
                await newEntry.save();
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            
        }


        else{
            res.status(400).json({ success: false, message: "Internal Server Error !" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error !" }) 
    }
}