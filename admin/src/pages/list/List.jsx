import "./list.scss"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"

const List = ({ columns }) => {
  return (
    <div className="list">
      <div className="listContainer">
        <div className="fixed bg-main-bg navbar w-full">
          <Navbar />
        </div>
        <Datatable columns={columns} />
      </div>
    </div>
  )
}

export default List