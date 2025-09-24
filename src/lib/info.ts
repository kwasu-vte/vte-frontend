// * Payment Utilities
// * SECURITY: All API calls now go through centralized api.ts service
// * No client-side token storage - uses httpOnly cookies via proxy

import { api } from './api';

export async function makePayment(params: { course: string; specialization: string | null }) {
    const { course, specialization: rawSpecialization } = params
    /** This function is used to make payment 
     * 
     *  Argument: 
     *     course: the course with the course code e.g vte-202
     *     specialization: This represents the specialization of the class
     *  Return: This returns the activation_url to be redirected to.
    **/
   const specialization = rawSpecialization === "" ? null : rawSpecialization;
   
   try {
        // * Not implemented in current API surface. Use enrollment payment flows instead.
        console.warn('makePayment is not supported by current API. Use payForEnrollment instead.');
        return false;
   } catch(err) {
        console.error('Payment error:', err);
        return false;
   }
}

export async function paystackRedirect({reference}: {reference: string}) {
    /** This function is used to check if the course has been activated
     * 
     *  Argument:
     *      reference: This is the reference
     *  return: It returns a msg to represent success.  
     */
    try {
        // * Not implemented in current API surface.
        console.warn('paystackRedirect is not supported by current API.');
        return false;
    } catch (err) {
        console.error('Course activation error:', err);
        return false;
    }
}