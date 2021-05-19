/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/currentRecord', 'N/log', 'N/record'],
    /**
     * @param{search} search
     * @param{currentRecord} currentRecord
     * @param{log} log
     * @param{record} record
     */
    (search, currentRecord, log, record) => {
        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */

        const beforeSubmit = (scriptContext) => {
            try {
                const printedmessage = "Your order will be ready within 60 minutes of placing your order.\n" +
                    "\n" +
                    "To keep your eBay account safe from fraudsters, we need you to bring photo ID with you to collect the item (Driving Licence, Passport or International ID Card). Only the named person on the order will be able to collect.\n" +
                    "\n" +
                    "Please make your way to this address:\n" +
                    "Customer Entrance\n" +
                    "Destiny Entertainments\n" +
                    "Unit C7, J31 Park\n" +
                    "Motherwell Way\n" +
                    "West Thurrock\n" +
                    "Essex\n" +
                    "RM20 3XD\n" +
                    "\n" +
                    "If your order is not collected within 14 days, we will cancel your order and refund you.";

                const record = scriptContext.newRecord;


                let DEL_OrderType = record.getValue({
                    fieldId: 'custbody_ordertype'
                });
                let DEL_SalesChannel = record.getValue({
                    fieldId: 'class'
                });
                let objFieldLookUp = search.lookupFields(
                    {
                        type : 'classification',
                        id : DEL_SalesChannel,
                        columns :
                            [
                                'custrecord_del_ebaysaleschannel'
                            ]
                    });

                let ebaychannel = objFieldLookUp["custrecord_del_ebaysaleschannel"];
               // log.debug({title: "search field", details: ebaychannel});

                if (ebaychannel == true) {
                            if (DEL_OrderType == "5") {
                                record.setValue({
                                    fieldId: 'custbody_printednotestocustomer',
                                    value: printedmessage,
                                    ignoreFieldChange: true
                                });
                                record.setValue({
                                    fieldId: 'custbody_del_collectionmessageadded',
                                    value: true,
                                    ignoreFieldChange: true
                                });

                                //log.debug({title: "result", details: "value set"});
                            } else {
                                record.setValue({
                                    fieldId: 'custbody_printednotestocustomer',
                                    value: "",
                                    ignoreFieldChange: true
                                });
                                // log.debug({
                                //     title: "DEL_OrderType Value",
                                //     details: "'" + DEL_OrderType + "'  <> 'Customer Collecting (5)'"
                                // });
                                //log.debug({title: "result", details: "value unset"});
                            }
                    } else {
                        //log.debug({title: "Skipped", details: "Sales Channel not Ebay"});
                    }

            } catch (e) {
                log.emergency({title: e.name, details: e.message});
            }
        }
        return {beforeSubmit}

    });
