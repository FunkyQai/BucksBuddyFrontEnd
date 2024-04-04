import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircularProgress from '@mui/material/CircularProgress';

function categorizeSentiment(score) {
    if (score < -0.5) return 'Mostly Negative';
    if (score < 0) return 'Negative';
    if (score === 0) return 'Neutral';
    if (score < 0.5) return 'Positive';
    return 'Mostly Positive';
}

function getColor(sentiment) {
    switch (sentiment) {
        case 'Positive':
        case 'Mostly Positive':
            return '#21de52';
        case 'Neutral':
            return '#da252e';
        case 'Negative':
        case 'Mostly Negative':
            return '#da252e';
        default:
            return 'black';
    }
}


export default function PortfolioNews({ pid }) {
    const [newsData, setNewsData] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleClickOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getNews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/portfolio/${pid}/portfolionews/`);
                const data = response.data;
                setIsLoading(false);
                setNewsData(data);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getNews();
    }, [pid]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Grid container spacing={3}>
            {newsData.data.map((item, index) => (
                <Grid item xs={12} sm={4} md={3} key={index}>
                    <Card sx={{
                        maxWidth: 345,
                        backgroundColor: "#32323e",
                        color: "#fff",
                        height: "380px",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transform: hoveredCard === item ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.3s',
                    }}
                        onClick={() => handleClickOpen(item)}
                        onMouseEnter={() => setHoveredCard(item)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >

                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                height="120"
                                image={item.image_url}
                                alt={item.title}
                            />
                            <CardContent>
                                <Typography variant="p">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: getColor(categorizeSentiment(item.entities[0].sentiment_score)) }}>
                                    {console.log(item.entities[0].sentiment_score)}
                                    {categorizeSentiment(item.entities[0].sentiment_score)}
                                </Typography>
                            </CardContent>
                        </Box>
                        <CardContent>
                            <Typography variant="body2" color="#89949d">
                                {formatDistanceToNow(new Date(item.published_at)) + " ago"}
                                <FiberManualRecordIcon sx={{ fontSize: 10, verticalAlign: "middle", marginLeft: "5px", marginRight: "5px" }} />
                                {item.source}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            <Dialog open={open} onClose={handleClose} PaperProps={{
                style: {
                    backgroundColor: "#32323e",
                    color: "#fff"
                }
            }}>
                <DialogTitle>{selectedItem?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#9ea7af" }}>
                        {selectedItem?.description}
                    </DialogContentText>

                    <Box mt={2}>
                        {selectedItem?.entities[0]?.highlights && (
                            <ul>
                                {selectedItem.entities[0].highlights.map((highlight, index) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: highlight.highlight }} />
                                ))}
                            </ul>
                        )}
                    </Box>
                    {selectedItem?.url && (
                        <Typography variant="body2" color="textSecondary" component="p" sx={{ color: "#9ea7af" }}>
                            Read more: <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">{selectedItem.url}</a>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}