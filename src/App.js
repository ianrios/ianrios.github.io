import React, { useState, useEffect } from 'react';
// import { Switch, Route, Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import './App.css';
import { projectData, hobbyData } from './data'
import Masonry from 'react-masonry-css'
import { Routes, Route } from 'react-router-dom';
import MetaBalls from './MetaBalls';
import { init, animate } from './three/webgl_marchingcubes'

const breakpointColumnsObj = {
	default: 3,
	992: 3,
	991: 1,

};

const colors = [
	'74A57F',
	'D30C7B',
	'57E2E5',
	'A50104',
	'EBF8B8',
	// '775144',
	'7FB069',
	'EFCA08',
	'A14DA0',
	'D11149',
	'A9FFF7',
	'97CC04',
	'31E981',
	'F0C808',
	'2EC4B6',
	'6320EE',
	'00D9C0',
];


function Main() {

	const [view, setView] = useState('welcome');
	// useEffect(() => {
	// 	const lsView = window.localStorage.getItem('view')
	// 	if (lsView) {
	// 		setView(lsView)
	// 	}
	// }, [])
	useEffect(() => {
		// window.localStorage.setItem('view', view)
		const threeContainer = document.getElementById('three-container')

		if (view === 'welcome') {
			// init();
			// animate();
		}
		else if (view === 'main') {
			// threeContainer.display = 'none';
			// remove all children
			while (threeContainer.firstChild) {
				threeContainer.removeChild(threeContainer.firstChild);
			}
		}
	}, [view])

	const [ul, setUl] = useState(false);
	const [modalShow, setModalShow] = useState(false);

	const [projectView, setProjectView] = useState(true);

	return (
		<>

			{view === 'welcome' && <div className="view-1">
				<MetaBalls />
				<p
					className={`name montserrat special-p color-${colors[colors.length * Math.random() | 0]}`}

				>
					Ian Rios
				</p>
				<p className='text-center special-b'>
					<button
						className="open-link montserrat"
						onClick={() => setView('main')}
					>enter</button>
				</p>
			</div>
			}
			{view === 'main' &&
				<div className="view-2">
					

					<button className="btn btn-link text-decoration-none h1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
						</svg>
					</button>

					<div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
						<div className="offcanvas-header">
							<h1 className="offcanvas-title montserrat" id="offcanvasExampleLabel">Ian Rios</h1>
							<button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
						</div>
						<div className="offcanvas-body montserrat">
							<h3>Portfolio</h3>
							<button className="h2-size first-h2 text-decoration-underline" onClick={() => setProjectView(!projectView)}>{projectView ? 'hobbies' : 'projects'}</button>
							<br />
							<button className="h2-size ul-show text-decoration-underline" onClick={() => setUl(!ul)}>external</button>

							<ul style={{ display: ul ? "block" : "none", fontSize: '1rem' }}>
								<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://github.com/ianrios/">github</a></li>
								<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://www.linkedin.com/in/ian-rios/">linkedin</a></li>
								<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://twitter.com/ian_rios_">twitter</a></li>
								<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://www.codewars.com/users/ianrios">codewars</a></li>
							</ul>
							{!ul && <br />}
							<button className="h2-size text-decoration-underline" onClick={() => setModalShow(true)}>contact</button>
						</div>
					</div>
					<MyVerticallyCenteredModal
						show={modalShow}
						onHide={() => setModalShow(false)}
					/>

					<p className='text-center'>
						<h1 style={{ marginTop: '-26px' }}>{projectView ? 'Projects' : 'Hobbies'}</h1>
					</p>

					<div className='container'
						style={{
							height: 'calc(100vh - 101px)',
							overflowY: 'auto'
						}}
					>
						<div className='row'
							style={{
								overflowY: 'scroll'
							}}
						>
							<div className='col-12'>
								<Masonry
									breakpointCols={breakpointColumnsObj}
									className="my-masonry-grid"
									columnClassName="my-masonry-grid_column">
									{projectView ?
										projectData.map((item, index) => {
											return (
												// <div className="col-12 col-sm-6 col-md-4 mb-4" key={index}>
												<div key={index}

													className={
														`card m-1 mb-4
													${((index % 2 !== 0 || index % 7 === 0) && index !== 0) && 'bg-secondary text-white'} 
													${(index % 5 === 0 && index !== 0 && index < 10) && 'bg-info'}
													`}
												>
													{/* <div className="card-header">
													</div> */}
													<div className="card-body">
														<h4 className="card-title fw-bolder">{item.title}</h4>
														{item.img_src_arr.length > 0 && <img className="card-img-top" src={item.img_src_arr[0]} alt={item.title} />}
														{item.img_src_arr.length > 1 && <img className="card-img-top" src={item.img_src_arr[1]} alt={item.body} />}
														<p className="card-text mt-3">{item.body}</p>
														{item.href.length > 0 && <a href={item.href} rel="noreferrer" target="_blank" className="btn btn-outline-dark">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
																<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
															</svg>
														</a>}
														{item.live.length > 0 && <a href={item.live} rel="noreferrer" target="_blank" className="btn btn-success mx-2">Visit Live Demo</a>}
														{item.title === 'Meta Spheres' && <a href='https://en.wikipedia.org/wiki/Metaballs' rel="noreferrer" target="_blank" className="btn btn-outline-secondary">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
																<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
																<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
															</svg>
														</a>}
													</div>
												</div>

											)
										})
										:
										hobbyData.map((item, index) => {
											return (

												<div key={index}

													className={
														`card m-2 
													${((index % 2 !== 0 || index % 7 === 0) && index !== 0) && 'bg-secondary text-white'} 
													${(index % 5 === 0 && index !== 0 && index < 10) && 'bg-info'}
													`}
												>

													<div className="card-body">
														<h4 className="card-title fw-bolder">{item.title}</h4>
														{item.img_src_arr.length > 0 && <img className="card-img-top" src={item.img_src_arr[0]} alt={item.title} />}
														{item.img_src_arr.length > 1 && <img className="card-img-top" src={item.img_src_arr[1]} alt={item.body} />}
														<p className="card-text mt-3">{item.body}</p>
														{item.href.length > 0 && <a href={item.href} rel="noreferrer" target="_blank" className="btn btn-outline-dark">Visit GitHub Repo</a>}
														{item.live.length > 0 && <a href={item.live} rel="noreferrer" target="_blank" className="btn btn-success mx-2">Visit Live Demo</a>}
														{item.instagram.length > 0 && <a href={item.instagram} rel="noreferrer" target="_blank" className="btn btn-success mx-2" style={{ backgroundColor: "purple" }}>
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
																<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
															</svg>
														</a>}
													</div>
												</div>
											)
										})}
								</Masonry>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
}

function MyVerticallyCenteredModal(props) {
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
					title='google-form'
				>
					Loading…
				</iframe>

			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-secondary" onClick={props.onHide}>Close</button>
			</Modal.Footer>
		</Modal>
	);
}

function App() {
	return (
		<Routes>
			<Route path='/' element={<Main />} />
			{/* <Route path='/three' element={} /> */}
		</Routes>
	)
}

export default App;
