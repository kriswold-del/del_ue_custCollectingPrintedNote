/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/action', 'N/currentRecord', 'N/log', 'N/record'],
    /**
     * @param{action} action
     * @param{currentRecord} currentRecord
     * @param{log} log
     * @param{record} record
     */
    (action, currentRecord, log, record) => {
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

                let DEL_OrderType_Category = record.getText({
                    fieldId: 'custbody_ordercategory'
                });
                let DEL_OrderType = record.getText({
                    fieldId: 'custbody_ordertype'
                });
                let DEL_SalesChannel = record.getText({
                    fieldId: 'class'
                });
                let DEL_SalesRep = record.getText({
                    fieldId: 'salesrep'
                });

                if(DEL_SalesRep == "Celigo EB disco_supplies" ||DEL_SalesRep == "Celigo EB essex-disco-supplies" ||DEL_SalesRep == "Celigo EB globalgazebo" ||DEL_SalesRep == "Celigo Ebay"){
                    if (DEL_SalesChannel == "Ebay : disco_supplies" || DEL_SalesChannel == "Ebay : electroxtra" || DEL_SalesChannel == "Ebay : essex-disco-supplies" || DEL_SalesChannel == "Ebay : globalgazebo" || DEL_SalesChannel == "Ebay : stage_concepts" || DEL_SalesChannel == "Ebay : stage_concepts_uk") {
                        if (DEL_OrderType_Category == "Online") {
                            if (DEL_OrderType == "Customer Collecting") {
                                record.setValue({
                                    fieldId: 'custbody_printednotestocustomer',
                                    value: printedmessage,
                                    ignoreFieldChange: true
                                });
                            } else {
                                record.setValue({
                                    fieldId: 'custbody_printednotestocustomer',
                                    value: "",
                                    ignoreFieldChange: true
                                });
                                log.debug({
                                    title: "DEL_OrderType Value",
                                    details: "'" + DEL_OrderType + "'  <> 'Customer Collecting'"
                                });
                            }
                        } else {
                            log.debug({title: "Skipped", details: "Order Type Category is not online"});
                        }
                    } else {
                        log.debug({title: "Skipped", details: "Sales Channel not in list"});
                    }
                } else {
                    log.debug({title: "Skipped", details: "Not a Celigo User"});
                }
            } catch (e) {
                log.emergency({title: e.name, details: e.message});
            }
        }
        return {beforeSubmit}

    });
