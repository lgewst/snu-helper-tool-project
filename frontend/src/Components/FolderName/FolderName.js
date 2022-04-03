import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Foldername = ( props ) => {
    const [folderList, setFolderList] = useState([]); 
    const history = useHistory();

    const init = async () => {
        const folderResponse = await axios.get('/user/');       //get folderlist
        setFolderList(folderResponse.data);
    }
    useEffect(() => {
        init();
      }, []);

    return(
        <div>
            <div className='folderList'>
                
                {folderList.map((folder) => (
                    <a className = 'folder' href = './{history}' key={folder.id}>{folder.id}</a>
                ))}
                
            </div>
            <div className='fileList'>

                fileNames
            </div>
        </div>
    )
    
}


export default Foldername;
