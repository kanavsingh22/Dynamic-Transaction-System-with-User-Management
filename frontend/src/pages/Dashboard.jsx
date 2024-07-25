import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react"
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={Math.round((balance + Number.EPSILON)*100)/100} />
            <button onClick={async () => {
                    const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    });
                    setBalance(response.data.acc_balance);
                }
            } type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Show Balance</button>
            <Users />
        </div>
    </div>
}