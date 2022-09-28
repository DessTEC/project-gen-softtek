import './index.css';

import { useState, useRef, useEffect } from 'react';
import Button from './global/Button';
import Input from './global/Input';
const Path = window.require('path');
const { remote } = require('electron');
const dialog = remote.require('electron').dialog;

const App = () => {

  const [isFormValidated, setIsFormValidated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [projectLocation, setProjectLocation] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [projectName, setProjectName] = useState({
    label: 'Nombre del proyecto',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor define un nombre del proyecto para poder continuar',
    valid: false,
  });
  const [firebaseProjectId, setFirebaseProjectId] = useState({
    label: 'ID del proyecto Firebase',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor define un id del proyecto para poder continuar',
    valid: false,
  });
  const [firebaseConfigs, setFirebaseConfigs] = useState({
    label: 'JSON con configuraciones generales de Firebase',
    type: 'file',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [firebaseAdminConfigs, setFirebaseAdminConfigs] = useState({
    label: 'JSON con configuraciones de administrador de Firebase',
    type: 'file',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  
  
  const handleProjectLocation = async () => {
    try {
      let path = null;
      var p = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      if (p.filePaths) {
        path = Path.normalize(p.filePaths[0])
      }
      setProjectLocation(path);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (projectName.value.trim() !== '' && projectName.required) {
      if (/^[a-zA-Z0-9-]*$/.test(projectName.value)) {
        setProjectName({ ...projectName, valid: true });
      } else {
        setProjectName({ ...projectName, valid: false, errorText: 'El nombre del proyecto solo puede estar conformado por letras, números, y guiones' });
      }
    } else {
      setProjectName({ ...projectName, valid: false, errorText: 'Por favor define un nombre del proyecto para poder continuar' });
    }

    if (firebaseProjectId.value.trim() !== '' && firebaseProjectId.required) {
      setFirebaseProjectId({ ...firebaseProjectId, valid: true });
    } else {
      setFirebaseProjectId({ ...firebaseProjectId, valid: false });
    }

    const resultFirebaseConfigs = validateFirebaseConfigs(firebaseConfigs.value)
    if(resultFirebaseConfigs.valid){
      setFirebaseConfigs({ ...firebaseConfigs, valid: true });
    }else{
      setFirebaseConfigs({ ...firebaseConfigs, valid: false, errorText: resultFirebaseConfigs.error});
    }

    const resultFirebaseAdminConfigs = validateFirebaseAdminConfigs(firebaseAdminConfigs.value)
    if(resultFirebaseAdminConfigs.valid){
      setFirebaseAdminConfigs({ ...firebaseAdminConfigs, valid: true });
    }else{
      setFirebaseAdminConfigs({ ...firebaseAdminConfigs, valid: false, errorText: resultFirebaseAdminConfigs.error});
    }

    setIsFormValidated(true);
  }

  useEffect(() => {
    if(isFormValidated){
        if ( //if all fields are valid, read excel and upload to firebase
        projectName.valid &&
        firebaseProjectId.valid &&
        firebaseConfigs.valid &&
        firebaseAdminConfigs.valid 
      ) {
        try {
          setLoading(true);
          const fbConfig = {
            apiKey: firebaseConfigs.value.apiKey,
            authDomain: firebaseConfigs.value.authDomain,
            projectId: firebaseConfigs.value.projectId,
            storageBucket: firebaseConfigs.value.storageBucket,
            messagingSenderId: firebaseConfigs.value.messagingSenderId,
            appId: firebaseConfigs.value.appId,
            firebaseProjectId: firebaseProjectId.value,
            type: firebaseAdminConfigs.value.type,
            project_id: firebaseAdminConfigs.value.project_id,
            private_key_id: firebaseAdminConfigs.value.private_key_id,
            private_key: firebaseAdminConfigs.value.private_key,
            client_email: firebaseAdminConfigs.value.client_email,
            client_id: firebaseAdminConfigs.value.client_id,
            auth_uri: firebaseAdminConfigs.value.auth_uri,
            token_uri: firebaseAdminConfigs.value.token_uri,
            auth_provider_x509_cert_url: firebaseAdminConfigs.value.auth_provider_x509_cert_url,
            client_x509_cert_url: firebaseAdminConfigs.value.client_x509_cert_url,
          }
          console.log(fbConfig)
          const projectPath = `${projectLocation}/${projectName.value}`
          console.log(projectPath)

          // //copy pwa folder
          // await generatePWA(projectLocation, projectName.value, iconImg, iconPath);
          // //generate .env
          // await generateEnv(projectPath, fbConfig, appName.value)
          // //generate .css
          // await generateCss(projectPath, appColor.value)
          // //generate app manifest
          // await generateManifest(projectPath, appName.value)
          setLoading(false);
        } catch (err) {
          console.log(err)
        }
      }
      setIsFormValidated(false);
    }
  }, [isFormValidated])

  const validateFirebaseConfigs = (jsonFirebase) => {
    const errorMessages = ["Por favor verifica que el archivo contenga los siguientes datos en el formato correcto:"]
    
    if (!(jsonFirebase.hasOwnProperty("apiKey") && jsonFirebase['apiKey'].trim() !== '')) {
      errorMessages.push("El apiKey no se encuentra presente") 
    }

    if(jsonFirebase.hasOwnProperty("authDomain") && jsonFirebase['authDomain'].trim() !== '') {
      if (!(/^[a-zA-Z0-9-\\.]*$/.test(jsonFirebase['authDomain']))) {
        errorMessages.push('El authDomain solo puede estar conformado por letras, números, guiones, y puntos')
      }
    } else {
        errorMessages.push('El authDomain no se encuentra presente')
    }

    if (jsonFirebase.hasOwnProperty("projectId") && jsonFirebase['projectId'].trim() !== '') {
      if (!(/^[a-zA-Z0-9-]*$/.test(jsonFirebase['projectId']))) {
        errorMessages.push('El projectId solo puede estar conformado por letras, números, y guiones')
      }
    } else {
      errorMessages.push('El projectId no se encuentra presente')
    }

    if (jsonFirebase.hasOwnProperty("storageBucket") && jsonFirebase['storageBucket'].trim() !== '') {
      if (!(/^[a-zA-Z0-9-\\.]*$/.test(jsonFirebase['storageBucket']))) {
        errorMessages.push('El storageBucket solo puede estar conformado por letras, números, guiones, y puntos')
      }
    } else {
      errorMessages.push('El storageBucket no se encuentra presente')
    }

    if (jsonFirebase.hasOwnProperty("messagingSenderId") && jsonFirebase['messagingSenderId'].trim() !== '') {
      if (!(/^[0-9]*$/.test(jsonFirebase['messagingSenderId']))) {
        errorMessages.push('El messagingSenderId solo puede estar conformado por números')
      }
    } else {
      errorMessages.push('El messagingSenderId no se encuentra presente')
    }

    if (!(jsonFirebase.hasOwnProperty("appId") && jsonFirebase['appId'].trim() !== '')) {
      errorMessages.push("El appId no se encuentra presente") 
    }

    const finalErrorMessage = errorMessages.join("\n");

    return {
      "valid": errorMessages.length === 1,
      "error": finalErrorMessage
    }
  }

  //Validate just presence of fields in JSON 
  const validateFirebaseAdminConfigs = (jsonFirebase) => {
    const errorMessages = ["Por favor verifica que el archivo contenga los siguientes datos:"]

    const requestedFields = ["type", "project_id", "private_key_id", "private_key", "client_email", "client_id", "auth_uri", "token_uri", "auth_provider_x509_cert_url", "client_x509_cert_url"]
    
    requestedFields.forEach((field) => {
      if (!(jsonFirebase.hasOwnProperty(field) && jsonFirebase[field].trim() !== '')) {
        errorMessages.push(`El ${field} no se encuentra presente`) 
      }
    })

    const finalErrorMessage = errorMessages.join("\n");

    return {
      "valid": errorMessages.length === 1,
      "error": finalErrorMessage
    }
  }

  const handleFirebaseConfigsUpload = (e) => {
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.onloadend = ()=>{
        try{
          const jsonFirebase = JSON.parse(fileReader.result)
          setFirebaseConfigs({...firebaseConfigs, value: jsonFirebase})
        }catch(e){
          alert("Error leyendo archivo")
        }
    }
    if( file!== undefined)
        fileReader.readAsText(file);
  }

  const handleFirebaseAdminConfigsUpload = (e) => {
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.onloadend = ()=>{
        try{
          const jsonFirebase = JSON.parse(fileReader.result)
          setFirebaseAdminConfigs({...firebaseAdminConfigs, value: jsonFirebase})
        }catch(e){
          alert("Error leyendo archivo")
        }
    }
    if( file!== undefined)
        fileReader.readAsText(file);
  }

  return (
    <>
      {loading &&
        <div className='flex flex-columns bg-[#00183380]'>
          <div className='w-14 h-10 rounded-sm boder-[#FAFCFF]'></div>
          <p className='text-sm text-white'>Estamos generando su mesa de regalos, espere porfavor...</p>
        </div>
      }
      <div className='flex flex-col'>
        <div className='flex justify-center'>
          <h1 className='text-3xl text-[#0284c7] font-black'>Generar mesa de regalos</h1>
        </div>

        <form className='flex flex-col' onSubmit={handleSubmit}>
          <section >

            <h2 className='font-black ml-4 mt-4 mb-2 text-xl'>
              Datos del proyecto local
            </h2>
              <Input
                label={projectName.label}
                type={projectName.type}
                handleValue={(value) => setProjectName({ ...projectName, value })}
                required={projectName.required}
                errorText={projectName.errorText}
                submitted={submitted}
                valid={projectName.valid}
              />

              <Input
                label='Ubicación donde se guardará el proyecto'
                type='looksLikeFile'
                value={projectLocation ? projectLocation : ''}
                name='projectLocation'
                size='lg'
                buttonLabel='Escoger ruta'
                handleValue={handleProjectLocation}
              />
          </section>
          <section>
            <h2 className='font-black ml-4 mt-4 mb-2 text-xl'>
              Datos de configuración de firebase
            </h2>
            <Input
              label={firebaseProjectId.label}
              type={firebaseProjectId.type}
              handleValue={(value) => setFirebaseProjectId({ ...firebaseProjectId, value })}
              required={firebaseProjectId.required}
              errorText={firebaseProjectId.errorText}
              submitted={submitted}
              valid={firebaseProjectId.valid}
            />
            <Input
              label={'JSON con configuraciones generales de Firebase'}
              type='file'
              name='firebaseConfigs'
              buttonLabel='Escoger archivo'
              accept='application/JSON'
              acceptMessage = "JSON file"
              errorText={firebaseConfigs.errorText}
              handleFiles={handleFirebaseConfigsUpload}
              submitted={submitted}
            />
            <Input
              label={'JSON con configuraciones de administrador de Firebase'}
              type='file'
              name='firebaseAdminConfigs'
              buttonLabel='Escoger archivo'
              accept='application/JSON'
              acceptMessage = "JSON file"
              errorText={firebaseAdminConfigs.errorText}
              handleFiles={handleFirebaseAdminConfigsUpload}
              submitted={submitted}
            />
          </section>
          <section>
            <Button variant='primary' label='Generar mesa de regalos' type='submit' />
          </section>
        </form>
      </div>
    </>
  );
}

export default App;
