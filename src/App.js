import React, { useState, useEffect } from "react";
// import { Switch, Route, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "./App.css";
import {
  independentProjectsData,
  hobbyData,
  workProjectsData,
  tools,
} from "./data";
import Masonry from "react-masonry-css";
import { Routes, Route } from "react-router-dom";
import MetaBalls from "./MetaBalls";
import MasonryCard from "./components/masonry-card";
// import { init, animate } from "./three/webgl_marchingcubes";

const breakpointColumnsObj = {
  default: 3,
  992: 3,
  991: 1,
};

const colors = [
  "74A57F",
  "D30C7B",
  "57E2E5",
  "A50104",
  "EBF8B8",
  // '775144',
  "7FB069",
  "EFCA08",
  "A14DA0",
  "D11149",
  "A9FFF7",
  "97CC04",
  "31E981",
  "F0C808",
  "2EC4B6",
  "6320EE",
  "00D9C0",
];

function Main() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [view, setView] = useState("welcome");

  useEffect(() => {}, []);

  const [page, setPage] = useState("projects");

  const workVisible = true; // get state from url

  //   useEffect(() => {
  //     if (workVisible) setPage("work");
  //   }, [workVisible]);

  // useEffect(() => {
  // 	const lsView = window.localStorage.getItem('view')
  // 	if (lsView) {
  // 		setView(lsView)
  // 	}
  // }, [])
  useEffect(() => {
    // window.localStorage.setItem('view', view)
    const threeContainer = document.getElementById("three-container");

    if (view === "welcome") {
      // init();
      // animate();
    } else if (view === "main") {
      // threeContainer.display = 'none';
      // remove all children
      while (threeContainer.firstChild) {
        threeContainer.removeChild(threeContainer.firstChild);
      }
    }
  }, [view]);

  const [onMobile, setOnMobile] = useState(false);
  useEffect(() => {
    setOnMobile(windowSize.width < 992);
  }, [windowSize.width]);

  const [ul, setUl] = useState(true);
  const [modalShow, setModalShow] = useState(false);

  const titleSelector = () => {
    const masonrygridDiv = document.getElementById("masonrygrid");
    if (masonrygridDiv) masonrygridDiv.scrollIntoView();

    switch (page) {
      case "work":
        return "experience";
      case "projects":
        return "projects";
      case "hobbies":
        return "hobbies";
      default:
        return "Not Found";
    }
  };

  const skills = Object.entries(
    [...workProjectsData, ...independentProjectsData].reduce((a, c) => {
      c.tools.forEach((t) => {
        if (a[t]) a[t]++;
        else a[t] = 1;
      });
      return a;
    }, {})
  );

  const [showTools, setShowTools] = useState(false);

  const sidebarBlock = (orientation) => {
    return (
      <>
        <h3 style={{ cursor: "default" }}>Portfolio</h3>
        {workVisible && (
          <>
            <button
              data-bs-toggle={orientation === "mobile" ? "offcanvas" : false}
              data-bs-target={
                orientation === "mobile" ? "#offcanvasExample" : false
              }
              className={`h2-size ${workVisible && "first-h2"}`}
              onClick={() => setPage("work")}
            >
              {page === "work" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <circle cx="8" cy="8" r="8" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                </svg>
              )}{" "}
              experience
            </button>
            <br />
          </>
        )}
        <button
          data-bs-toggle={orientation === "mobile" ? "offcanvas" : false}
          data-bs-target={
            orientation === "mobile" ? "#offcanvasExample" : false
          }
          className={`h2-size ${!workVisible && "first-h2"} `}
          onClick={() => setPage("projects")}
        >
          {page === "projects" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-circle-fill"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            </svg>
          )}{" "}
          projects
        </button>
        <br />
        <button
          data-bs-toggle={orientation === "mobile" ? "offcanvas" : false}
          data-bs-target={
            orientation === "mobile" ? "#offcanvasExample" : false
          }
          className="h2-size"
          onClick={() => setPage("hobbies")}
        >
          {page === "hobbies" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-circle-fill"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            </svg>
          )}{" "}
          hobbies
        </button>
        <br />
        <button className="h2-size" onClick={() => setShowTools(!showTools)}>
          skills{" "}
          {showTools ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          )}
        </button>
        {showTools && (
          <>
            {/* use number of times tool used to make font larger but make it look cool */}
            <p style={{ fontSize: "8px", overflow: "scroll" }}>
              {skills
                .sort((a, b) => a[1] < b[1])
                .map((o, i) => (
                  <React.Fragment key={i}>
                    {tools[o[0]] ? (
                      <a
                        className="flat-link"
                        href={tools[o[0]]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {o[0]}
                      </a>
                    ) : (
                      o[0]
                    )}

                    {/* ({o[1]}) */}
                    {i < skills.length - 1 && ", "}
                  </React.Fragment>
                ))}
            </p>
          </>
        )}
        {!showTools && <br />}
        <button className="h2-size ul-show" onClick={() => setUl(!ul)}>
          external{" "}
          {ul ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          )}
        </button>
        <ul style={{ display: ul ? "block" : "none", fontSize: "1rem" }}>
          <li>
            <a
              className="flat-link"
              rel="noreferrer"
              target="_blank"
              href="https://github.com/ianrios/"
            >
              personal github
            </a>
          </li>
          <li>
            <a
              className="flat-link"
              rel="noreferrer"
              target="_blank"
              href="https://github.com/ianriosbaf/"
            >
              work github
            </a>
          </li>
          <li>
            <a
              className="flat-link"
              rel="noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/ian-rios/"
            >
              linkedin
            </a>
          </li>
          <li>
            <a
              className="flat-link"
              rel="noreferrer"
              target="_blank"
              href="https://www.codewars.com/users/ianrios"
            >
              codewars
            </a>
          </li>
        </ul>
        {!ul && <br />}
        <button className="h2-size" onClick={() => setModalShow(true)}>
          contact{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </>
    );
  };

  return (
    <>
      {view === "welcome" && (
        <div className="view-1">
          <MetaBalls />
          <p
            className={`name montserrat special-p color-${
              colors[(colors.length * Math.random()) | 0]
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setView("main")}
          >
            Ian Rios
          </p>
          <p className="text-center special-b">
            <button
              className="open-link montserrat"
              onClick={() => setView("main")}
            >
              enter
            </button>
          </p>
        </div>
      )}
      {view === "main" && (
        <div className="container-fluid">
          <div className="row view-2 ">
            {onMobile ? (
              <>
                <button
                  style={{
                    height: "60px",
                    width: "60px",
                    position: "absolute",
                  }}
                  className="btn btn-link text-decoration-none h1"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExample"
                  aria-controls="offcanvasExample"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-list"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
                <div
                  className="offcanvas offcanvas-start"
                  tabIndex="-1"
                  id="offcanvasExample"
                  aria-labelledby="offcanvasExampleLabel"
                  data-bs-scroll="true"
                  data-bs-backdrop="false"
                >
                  <div className="offcanvas-header">
                    <h1
                      className="offcanvas-title montserrat"
                      id="offcanvasExampleLabel"
                      style={{ cursor: "default" }}
                    >
                      Ian Rios
                    </h1>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    />
                  </div>
                  <div className="offcanvas-body montserrat">
                    {sidebarBlock("mobile")}
                  </div>
                </div>
              </>
            ) : (
              <div className="col-2" style={{ marginTop: "20px" }}>
                <h1 style={{ marginBottom: "40px", cursor: "default" }}>
                  Ian Rios
                </h1>
                {sidebarBlock("desktop")}
              </div>
            )}
            <div
              className={`main-view-container ${onMobile ? "col" : "col-10"}`}
            >
              <div className="text-center">
                <div
                  style={{ marginTop: "20px", cursor: "default" }}
                  className="h1"
                >
                  {titleSelector()}
                </div>
              </div>

              <div
                className="container"
                style={{
                  height: "calc(100vh - 80px)",
                  overflowY: "auto",
                }}
              >
                <div
                  className="row"
                  style={{
                    overflowY: "scroll",
                  }}
                >
                  <div className="col-12">
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="my-masonry-grid"
                      id="masonrygrid"
                      columnClassName="my-masonry-grid_column"
                    >
                      {page === "work" &&
                        workProjectsData.map((item, index) => (
                          <MasonryCard key={index} item={item} index={index} />
                        ))}
                      {page === "projects" &&
                        independentProjectsData.map((item, index) => (
                          <MasonryCard key={index} item={item} index={index} />
                        ))}
                      {page === "hobbies" &&
                        hobbyData.map((item, index) => (
                          <MasonryCard key={index} item={item} index={index} />
                        ))}
                    </Masonry>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ContactModal show={modalShow} onHide={() => setModalShow(false)} />
        </div>
      )}
    </>
  );
}

function ContactModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="modal-body">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdZuZHU8gkftr7wgn5DF2nYYG8Ds4HCDp-Vh-_OfYIE-YoBwQ/viewform?embedded=true"
          scrolling="no"
          className="iframe-google-form"
          width="640"
          height="979"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="google-form"
        >
          Loading…
        </iframe>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      {/* <Route path='/three' element={} /> */}
    </Routes>
  );
}

export default App;
