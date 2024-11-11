import {useEffect} from 'react';
import Cookies from 'js-cookie';
// Install cookies from js-cookies;

export async function makePayment({course, specialization}: {course: string, specialization: string | null}) {
    /** This function is used to make payment 
     * 
     *  Argument: 
     *     course: the course with the course code e.g vte-202
     *     specialization: This represents the specilization of the class
     *  Return: This returns the activitation_url to be redirected to.
    **/
   specialization = specialization == "" ? null : specialization;
   try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/register_course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${Cookies.get('access_token')}`
            },
            body: JSON.stringify({course, specialization}),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status == true) {
                Cookies.set('course', course)
                return data.data.authorization_url;
            }
        }
        return false;
   } catch(err) {
        console.log(err);
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
        const course = Cookies.get('course');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/activate?reference=${reference}&course_name=${course}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Cookies.get("access_token")}`
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            Cookies.remove("course");
            return (data.msg);
        }
        return false;
    } catch (err) {
        return false;
    }
}