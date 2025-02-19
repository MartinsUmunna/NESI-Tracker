import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Chip,
    Stack,
    Typography,
    Collapse,
    Paper,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import {
    IconFilter,
    IconX,
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons';

const DynamicFilters = ({ data, onFilterChange }) => {
    const theme = useTheme();
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({});
    
    // Detect available filters from data
    const filters = useMemo(() => detectFilters(data), [data]);
    const groupedFilters = useMemo(() => groupFiltersByCategory(filters), [filters]);

    // Category colors
    const categoryColors = {
        entity: theme.palette.primary.main,
        type: theme.palette.secondary.main,
        location: theme.palette.success.main,
        time: theme.palette.info.main,
        other: theme.palette.warning.main
    };

    const handleCategoryClick = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const handleFilterSelect = (category, filter, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (!newFilters[category]) {
                newFilters[category] = {};
            }
            if (!newFilters[category][filter]) {
                newFilters[category][filter] = new Set();
            }
            const filterSet = new Set(newFilters[category][filter]);
            
            if (filterSet.has(value)) {
                filterSet.delete(value);
                if (filterSet.size === 0) {
                    delete newFilters[category][filter];
                    if (Object.keys(newFilters[category]).length === 0) {
                        delete newFilters[category];
                    }
                }
            } else {
                filterSet.add(value);
            }
            
            newFilters[category][filter] = filterSet;
            return newFilters;
        });
    };

    useEffect(() => {
        onFilterChange(selectedFilters);
    }, [selectedFilters, onFilterChange]);

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                mb: 2
            }}
        >
            <Stack spacing={2}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                >
                    <IconFilter size={20} />
                    <Typography variant="subtitle1">Dynamic Filters</Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.entries(groupedFilters).map(([category, categoryFilters]) => (
                        <Box key={category}>
                            <Chip
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                            {category}
                                        </Typography>
                                        <Chip
                                            label={Object.keys(categoryFilters).length}
                                            size="small"
                                            sx={{ 
                                                height: 16,
                                                '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                                            }}
                                        />
                                    </Stack>
                                }
                                onClick={() => handleCategoryClick(category)}
                                sx={{
                                    borderColor: categoryColors[category],
                                    bgcolor: expandedCategory === category 
                                        ? alpha(categoryColors[category], 0.1)
                                        : 'transparent',
                                    '&:hover': {
                                        bgcolor: alpha(categoryColors[category], 0.2)
                                    }
                                }}
                                variant="outlined"
                                icon={expandedCategory === category ? 
                                    <IconChevronUp size={16} /> : 
                                    <IconChevronDown size={16} />
                                }
                            />
                            
                            <Collapse in={expandedCategory === category}>
                                <Box sx={{ mt: 1, ml: 2 }}>
                                    {Object.entries(categoryFilters).map(([filter, { values, name }]) => (
                                        <Box key={filter} sx={{ mb: 1 }}>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ ml: 1, color: 'text.secondary' }}
                                            >
                                                {name}
                                            </Typography>
                                            <Stack 
                                                direction="row" 
                                                spacing={1} 
                                                flexWrap="wrap" 
                                                sx={{ mt: 0.5 }}
                                            >
                                                {values.map((value) => {
                                                    const isSelected = selectedFilters[category]?.[filter]?.has(value);
                                                    return (
                                                        <Chip
                                                            key={value}
                                                            label={value}
                                                            size="small"
                                                            onClick={() => handleFilterSelect(category, filter, value)}
                                                            sx={{
                                                                mb: 0.5,
                                                                bgcolor: isSelected 
                                                                    ? alpha(categoryColors[category], 0.1)
                                                                    : 'transparent',
                                                                borderColor: isSelected 
                                                                    ? categoryColors[category]
                                                                    : 'divider',
                                                                '&:hover': {
                                                                    bgcolor: alpha(categoryColors[category], 0.2)
                                                                }
                                                            }}
                                                            variant={isSelected ? "filled" : "outlined"}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Stack>

                {Object.keys(selectedFilters).length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                            Active Filters:
                        </Typography>
                        {Object.entries(selectedFilters).map(([category, filters]) => (
                            Object.entries(filters).map(([filter, values]) => (
                                Array.from(values).map(value => (
                                    <Chip
                                        key={`${category}-${filter}-${value}`}
                                        label={`${formatFilterName(filter)}: ${value}`}
                                        size="small"
                                        onDelete={() => handleFilterSelect(category, filter, value)}
                                        sx={{ mb: 0.5 }}
                                        color="primary"
                                    />
                                ))
                            ))
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};

export default DynamicFilters;