import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Path = ( props ) => {
    const [path, setPath] = useState({ });

    const init = async () => {
        const pathResponse = await axios.get('/user/1');
        setPath(pathResponse.data);
    }
    useEffect(() => {
        init();
      }, []);

    return(
        <div>
            <div className='path'>
                <p>path {path.id}</p>
            </div>
        </div>
    )
    
}


export default Path;
