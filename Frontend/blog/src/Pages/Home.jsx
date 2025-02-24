import Header from "../components/Header";
import Posts from "../components/Posts";
//import SideBar from "../components/SideBar";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <div className="home">
        <Posts />
        {/* <SideBar /> */}
      </div>
    </>
  );
}
