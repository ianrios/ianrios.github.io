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
				<p className="name special-p">Ian Rios</p>
				<p className='text-center special-b'>
					<button
						className="open-link"
						onClick={() => setView('main')}
					>enter</button>
				</p>
			</div>
			}
			{view === 'main' &&
				<div className="view-2">
					<div className="sidebar">
						<div id="header">
							<h1>Ian Rios</h1>
							<div id="expandButton"></div>
						</div>

						<button className="h2-size first-h2" onClick={() => setProjectView(!projectView)}>{projectView ? 'hobbies' : 'projects'}</button>
						<button className="h2-size ul-show" onClick={() => setUl(!ul)}>social</button>
						<ul style={{ display: ul ? "block" : "none" }}>
							<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://github.com/ianrios/">github</a></li>
							<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://www.linkedin.com/in/ian-rios/">linkedin</a></li>
							<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://twitter.com/ian_rios_">twitter</a></li>
							<li><a className="flat-link" rel="noreferrer" target="_blank" href="https://www.codewars.com/users/ianrios">codewars</a></li>
						</ul>


						<button className="h2-size" onClick={() => setModalShow(true)}>contact</button>
						<MyVerticallyCenteredModal
							show={modalShow}
							onHide={() => setModalShow(false)}
						/>
						{/* <button className="h2-size back-link" onClick={() => setView('welcome')}>back</button> */}
					</div>
					{/* <Switch>
						<Route to>

						</Route>
					</Switch> */}
					<p className='text-center'>
						<h3 className='pt-5'>{projectView ? 'Projects' : 'Hobbies'}</h3>
					</p>
					{projectView ?
						<div className='container'>
							<div className='row'>
								<div className='col-11 offset-1'>
									{/* <div class="card-group"> */}
									{/* <div className="row" //  row-cols-md-1 row-cols-lg-3
										data-masonry='{"percentPosition": true }'
									> */}
									<Masonry
										breakpointCols={breakpointColumnsObj}
										className="my-masonry-grid"
										columnClassName="my-masonry-grid_column">
										{projectData.map((item, index) => {
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
														<h5 className="card-title fw-bolder">{item.title}</h5>
														{item.img_src_arr.length > 0 && <img className="card-img-top" src={item.img_src_arr[0]} alt={item.title} />}
														{item.img_src_arr.length > 1 && <img className="card-img-top" src={item.img_src_arr[1]} alt={item.body} />}
														<p className="card-text">{item.body}</p>
														{item.href.length > 0 && <a href={item.href} rel="noreferrer" target="_blank" className="btn btn-outline-dark">Visit GitHub Repo</a>}
														{item.live.length > 0 && <a href={item.live} rel="noreferrer" target="_blank" className="btn btn-success mx-2">Visit Live Demo</a>}
													</div>
													{/* <div className="card-footer">
													</div> */}
												</div>
												// </div>
											)
										})}
									</Masonry>
									{/* </div> */}
									{/* </div> */}
								</div>
							</div>
						</div>
						:
						<div className='container'>
							<div className='row'>
								<div className='col-11 offset-1'>
									{/* <div class="card-group"> */}
									{/* <div className="row" //  row-cols-md-1 row-cols-lg-3
										data-masonry='{"percentPosition": true }'
									> */}
									<Masonry
										breakpointCols={breakpointColumnsObj}
										className="my-masonry-grid"
										columnClassName="my-masonry-grid_column">
										{hobbyData.map((item, index) => {
											return (
												// <div className="col-12 col-sm-6 col-md-4 mb-4" key={index}>
												<div key={index}

													className={
														`card m-2 
													${((index % 2 !== 0 || index % 7 === 0) && index !== 0) && 'bg-secondary text-white'} 
													${(index % 5 === 0 && index !== 0 && index < 10) && 'bg-info'}
													`}
												>
													{/* <div className="card-header">
													</div> */}
													<div className="card-body">
														<h5 className="card-title fw-bolder">{item.title}</h5>
														{item.img_src_arr.length > 0 && <img className="card-img-top" src={item.img_src_arr[0]} alt={item.title} />}
														{item.img_src_arr.length > 1 && <img className="card-img-top" src={item.img_src_arr[1]} alt={item.body} />}
														<p className="card-text">{item.body}</p>
														{item.href.length > 0 && <a href={item.href} rel="noreferrer" target="_blank" className="btn btn-outline-dark">Visit GitHub Repo</a>}
														{item.live.length > 0 && <a href={item.live} rel="noreferrer" target="_blank" className="btn btn-success mx-2">Visit Live Demo</a>}
														{item.instagram.length > 0 && <a href={item.instagram} rel="noreferrer" target="_blank" className="btn btn-success mx-2" style={{ backgroundColor: "purple" }}>Visit Instagram</a>}

													</div>
													{/* <div className="card-footer">
													</div> */}
												</div>

												// </div>
											)
										})}
									</Masonry>
									{/* </div> */}
									{/* </div> */}
								</div>
							</div>
						</div>}
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
