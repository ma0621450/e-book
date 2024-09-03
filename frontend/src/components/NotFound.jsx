import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1 className="display-1">404</h1>
                    <p className="lead">Page Not Found</p>
                    <Button variant="primary" onClick={handleGoHome}>
                        Go Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
