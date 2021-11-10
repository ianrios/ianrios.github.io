import React, { useState, useEffect } from 'react';
// import { Switch, Route, Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import './App.css';
import { data } from './data'



function App() {

	const [view, setView] = useState('welcome');
	useEffect(() => {
		const lsView = window.localStorage.getItem('view')
		if (lsView) {
			setView(lsView)
		}
	}, [])
	useEffect(() => {
		window.localStorage.setItem('view', view)
	}, [view])

	const [ul, setUl] = useState(false);
	const [modalShow, setModalShow] = useState(false);

	const [projectView, setProjectView] = useState(false);

	return (
		<>

			{view === 'welcome' && <div className="view-1">
				<p className="name">Ian Rios</p>
				<p className='text-center'>
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

						<button className="h2-size first-h2" onClick={() => setProjectView(true)}>projects</button>

						<button onClick={() => setUl(!ul)} className="h2-size ul-show" >social</button>
						<ul style={{ display: ul ? "block" : "none" }}>
							<li><a className="flat-link" target="_blank" href="https://github.com/ianrios/">github</a></li>
							<li><a className="flat-link" target="_blank" href="https://www.linkedin.com/in/ian-rios/">linkedin</a></li>
							<li><a className="flat-link" target="_blank" href="https://twitter.com/ian_rios_">twitter</a></li>
							<li><a className="flat-link" target="_blank" href="https://www.codewars.com/users/ianrios">codewars</a></li>
						</ul>


						<button className="h2-size" onClick={() => setModalShow(true)}>contact</button>
						<MyVerticallyCenteredModal
							show={modalShow}
							onHide={() => setModalShow(false)}
						/>
						<button
							className="h2-size back-link"
							onClick={() => setView('welcome')}

						>back</button>
					</div>
					{/* <Switch>
						<Route to>

						</Route>
					</Switch> */}
					<p className='text-center'>
						<h3 className='pt-5'>Projects</h3>
					</p>
					<div className='container'>
						<div className='row'>
							<div className='col-11 offset-1'>
								{/* <div class="card-group"> */}
								<div className="row row-cols-md-1 row-cols-lg-3"

								// data-masonry='{"percentPosition": true }'
								>
									{data.map((item, index) => {
										return (
											<div className='col' key={index}>
												<div className="card m-2" >
													<div className="card-body">
														<h5 className="card-title">{item.title}</h5>
														<img className="card-img-top" src={item.img_src} alt="Card image cap" />
														<p className="card-text">{item.body}</p>
														{item.href.length > 0 && <a href={item.href} target="_blank" className="btn btn-secondary">Visit GitHub Repo</a>}
														{item.live.length > 0 && <a href={item.live} target="_blank" className="btn btn-succcess">Visit Live Demo</a>}
													</div>
												</div>
											</div>
										)
									})}
									{/* </div> */}
								</div>
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


export default App;
