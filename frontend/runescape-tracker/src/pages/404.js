import React, { useEffect } from "react";
import "./styles/404.css";

const Notfound = () => {
    useEffect(() => {
        document.title = "404 - Not Found";
    }, []);

	return (
		<React.Fragment>
			<div className="not-found page-content">
				<div className="content-wrapper">
					<div className="notfound-container">
						<div className="notfound-message">
							<div className="notfound-title">
								Oops! Page not found
							</div>
							<div className="not-found-message">
								We can't seem to find the page you're looking
								for.
								<br />
								The requested URL "{window.location.href}" was
								not found on this server.
							</div>
							<a href="/" className="not-found-link">
								Go back to the home page
							</a>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Notfound;
