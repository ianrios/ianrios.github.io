import React, { useState, useEffect } from 'react';
import { findDOMNode } from "react-dom";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import Modal from 'react-bootstrap/Modal'
import './App.css';



function App() {
	const [view, setView] = useState(true);
	const [ul, setUl] = useState(false);
	const [modalShow, setModalShow] = useState(false);


	return (
		<Router>

			{view ? (
				<div className="view-1">
					<p className="name">
						Ian Rios
				</p>
					<a
						className="open-link"
						href="#"
						rel="noopener noreferrer"
						onClick={() => setView(false)}
					>
						enter
				</a>
				</div>
			) : (
					<div className="view-2">
						<div className="sidebar">
							<div id="header">
								<h1>Ian Rios</h1>
								<div id="expandButton"></div>
							</div>

							<a className="h2-size first-h2">
								projects
								</a>

							<a onClick={() => setUl(!ul)} className="h2-size ul-show">
								social
							</a>

							<ul style={{ display: ul ? "block" : "none" }}>
								<li><a className="flat-link" target="_blank" href="https://github.com/ianrios/">github</a></li>
								<li><a className="flat-link" target="_blank" href="https://www.linkedin.com/in/ian-rios/">linkedin</a></li>
								<li><a className="flat-link" target="_blank" href="https://twitter.com/ian_rios_">twitter</a></li>
								<li><a className="flat-link" target="_blank" href="https://www.codewars.com/users/ianrios">codewars</a></li>
							</ul>



							<a className="h2-size" onClick={() => setModalShow(true)}>contact</a>
							<MyVerticallyCenteredModal
								show={modalShow}
								onHide={() => setModalShow(false)}
							/>


							<a
								className="h2-size back-link"
								onClick={() => setView(view - 1)}
							>
								back
							</a>
						</div>

						<div className="grid">
							blah
						</div>
					</div>
				)
			}
		</Router >
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
				<a onClick={props.onHide}>Close</a>
			</Modal.Footer>
		</Modal>
	);
}


export default App;
