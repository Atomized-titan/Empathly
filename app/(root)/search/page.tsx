import {fetchAllUsers} from "@/lib/actions/users.actions";

async function Page() {
    const allUsers = await fetchAllUsers("*", 1, 10)
    console.log(allUsers);
    return (
        <main>
            {allUsers.users.map((el) => {
                return (
                    <div key={1}>
                        el.
                    </div>
                )
            })}
        </main>
    )
 }

 export default Page;