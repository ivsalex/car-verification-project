import React from 'react';

const Cars = () => {
    // const [users, setUsers] = useState([]);

    // const fetchUsersData = async () => {
    //     try {
    //         const response = await fetch('http://localhost:3001/users/', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Bearer ' + Cookies.get("token")
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         setUsers(data?.users);

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }
    // useEffect(() => {
    //     const token = Cookies.get('token');
    //     if (!token) {
    //         window.location.href = '/login'
    //     }
    //     fetchUsersData();
    // }, []);

    return (
        <div>
            <h1>Cars page</h1>
        </div>
    );
};

export default Cars;