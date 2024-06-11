import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

export default function Home() {

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);

    const [cardsData, setCardsData] = useState([]);

    const fetchVideos = () => {
        axios.get("http://localhost:5000/video")
            .then(response => {
                setCardsData(response.data.videos);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const [video, setVideo] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    function videoInput(e) {
        setVideo(e.target.value);
    }

    function titleInput(e) {
        setTitle(e.target.value);
    }

    function contentInput(e) {
        setContent(e.target.value);
    }

    function addVideo() {
        axios.post("http://localhost:5000/add", { video, title, content })
            .then(() => {
                handleCloseAddModal();
                setVideo('');
                setTitle('');
                setContent('');
                fetchVideos();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const [id, setId] = useState(null);

    function edit(i) {
        setId(i._id);
        setVideo(i.videoUrl);
        setTitle(i.title);
        setContent(i.text);
        handleShowEditModal();
    }

    function editVideo() {
        axios.put("http://localhost:5000/edit", { id, video, title, content })
            .then(() => {
                handleCloseEditModal();
                setId(null);
                setVideo('');
                setTitle('');
                setContent('');
                fetchVideos();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function deleteVideo(i) {
        axios.post("http://localhost:5000/delete", { id: i._id })
            .then(() => {
                fetchVideos();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <Modal
                show={showAddModal}
                onHide={handleCloseAddModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Video</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
                    <input type="text" value={video} placeholder="Video" style={{ marginTop: "10px" }} onChange={videoInput} />
                    <input type="text" value={title} placeholder="Title" style={{ marginTop: "10px" }} onChange={titleInput} />
                    <input type="text" value={content} placeholder="Content" style={{ marginTop: "10px" }} onChange={contentInput} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addVideo}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Video</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
                    <input type="text" value={video} placeholder="Video" style={{ marginTop: "10px" }} onChange={videoInput} />
                    <input type="text" value={title} placeholder="Title" style={{ marginTop: "10px" }} onChange={titleInput} />
                    <input type="text" value={content} placeholder="Content" style={{ marginTop: "10px" }} onChange={contentInput} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editVideo}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">Video Streaming</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success" onClick={handleShowAddModal}>Add</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row>
                {cardsData.map((card, index) => (
                    <Col key={index} sm={6} md={4} lg={3}>
                        <Card style={{ margin: '10px' }}>
                            <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <Card.Text>{card.text}</Card.Text>
                                <iframe
                                    width="100%"
                                    height="215"
                                    src={card.videoUrl}
                                    frameBorder="0"
                                    allowFullScreen
                                    title={`Embedded Video ${index}`}>
                                </iframe>
                                <Button variant="primary" style={{ margin: "10px" }} onClick={() => { edit(card) }}>Edit</Button>
                                <Button variant="primary" style={{ margin: "10px" }} onClick={() => { deleteVideo(card) }}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}