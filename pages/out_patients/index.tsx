import React, { useEffect, useState } from 'react'
import styles from './out.module.scss'

function OutPatients() {
const [patients, setPatients] = useState<any>([]);

  useEffect(() => {
    const checkPatients = () => {
        patients.forEach((patient:any) => {
          const regDateTime:Date = new Date(`${patient.regDate}T${patient.regTime}`);
          const now:Date = new Date();
          const timeDiff = now.getTime() - regDateTime.getTime();
          const hoursDiff = (now.getTime() - regDateTime.getTime()) / (1000 * 60 * 60);
    
          if (hoursDiff < 24) {
            console.log('less than 24')
            if(!['one', 'two'].includes(patient.category.toLowerCase())){
                console.log('please go for vitals',hoursDiff)
            }else{
                console.log('you can proceed')
            }
          }else{
            console.log(`greater than 24`)
          }
        });
      };
    
      checkPatients();
    const intervalId = setInterval(() => {
      const newPatients = generatePatients();
      console.log('API Call:', newPatients);
      setPatients(newPatients);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [patients]);
    const generatePatient = () => {
        const categories = ['one', 'two', 'three', 'four'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomName = `Patient-${Math.floor(Math.random() * 1000)}`;
        const randomMRNumber = Math.floor(Math.random() * 100000);
        const randomAge = Math.floor(Math.random() * 100);
        const randomSex = Math.random() > 0.5 ? 'Male' : 'Female';
        const now = new Date();
        const regDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const regTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
        const consDate = regDate; // Assuming consultation date is the same as registration date
        const consTime = regTime; // Assuming consultation time is the same as registration time
        const randomDoctor = `Doctor-${Math.floor(Math.random() * 100)}`;
        const randomConsultationDoctor = `ConsultationDoctor-${Math.floor(Math.random() * 100)}`;
        const patientType = 'Outpatient';
        const patientCategory = 'General';
        const exemptionCategory = 'None';
        const initialDiagnosis = 'N/A';
        const creditCompanyName = 'N/A';
      
        return {
          name: randomName,
          category: randomCategory,
          mrNumber: randomMRNumber,
          age: randomAge,
          sex: randomSex,
          regDate,
          regTime,
          consDate,
          consTime,
          doctor: randomDoctor,
          consultationDoctor: randomConsultationDoctor,
          patientType,
          patientCategory,
          exemptionCategory,
          initialDiagnosis,
          creditCompanyName,
        };
      };
      
      // Function to generate an array of patients
      const generatePatients = (count = 10) => {
        const patients = [];
        for (let i = 0; i < count; i++) {
          patients.push(generatePatient());
        }
        return patients;
      };
  return (
    <div className={styles.patients}>
        {
            patients.length>0 
            ? <div className={styles.patient}>
                {
                    patients.map((item:any,index:number)=> (
                        <p>{item.name},{item.category}</p>
                    ))
                }
            </div>
            : <h1>No Patients</h1>
        }
    </div>
  )
}

export default OutPatients