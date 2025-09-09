// * Payment Utilities
// * SECURITY: All API calls now go through centralized api.ts service
// * No client-side token storage - uses httpOnly cookies via proxy

import { api } from './api';

export async function makePayment({course, specialization}: {course: string, specialization: string | null}) {
    /** This function is used to make payment 
     * 
     *  Argument: 
     *     course: the course with the course code e.g vte-202
     *     specialization: This represents the specialization of the class
     *  Return: This returns the activation_url to be redirected to.
    **/
   specialization = specialization === "" ? null : specialization;
   
   try {
        // * Use centralized API service - no client-side token handling
        const response = await api.makePayment({ course, specialization });
        
        if (response.success) {
            return response.data.authorization_url;
        }
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
        // * Use centralized API service - no client-side token handling
        const response = await api.activateCourse({ reference });
        
        if (response.success) {
            return response.data.msg;
        }
        return false;
    } catch (err) {
        console.error('Course activation error:', err);
        return false;
    }
}