import {useEffect} from 'react';
import Cookies from 'js-cookie';
// Install cookies from js-cookies;

export async function makePayment({course, specialization}: {course: string, specialization: string}) {
    /** This function is used to make payment 
     * 
     *  Argument: 
     *     course: the course with the course code e.g vte-202
     *     specialization: This represents the specilization of the class
     *  Return: This returns the activitation_url to be redirected to.
    **/
    const response = await fetch("https://vte-backend.onrender.com/api/auth/register_course", {
        method: "POST",
        body: JSON.stringify({
            course: `${course}`,
            specialization: `${specialization}`,
        }),
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        }
    });

    if (response.status == 200) {
        const data = await response.json();
        if (data.status == true) {
            Cookies.set('course', `${course}`)
            return data.authorization_url;
        }
    }
}

export async function paystackRedirect({reference}: {reference: string}) {
    /** This function is used to check if the course has been activated
     * 
     *  Argument:
     *      reference: This is the reference
     *  return: It returns a msg to represent success.  
     */
    const course = Cookies.get('course');
    const response = await fetch("https://vte-backend.onrender.com/api/auth/activate", {
        method: "POST",
        body: JSON.stringify({
            reference: `${reference}`,
            course_name: `${course}`,
        }),
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        }
    });
    
    if (response.status == 200) {
        const data = await response.json();
        return (data.msg);
    }
}