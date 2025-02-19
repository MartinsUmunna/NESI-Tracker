import axios from 'axios';
import API_URL from '../config/apiconfig';

const computeCapacityYearly = (data) => {
    const groups = data.reduce((acc, item) => {
        const key = `${item.Year}_${item.Source}`; 
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const yearly = Object.entries(groups).map(([yearSource, items]) => {
        const [year, source] = yearSource.split('_');
        
        // Get unique plants to avoid double counting
        const plantGroups = items.reduce((acc, it) => {
            const plant = it.Plant;
            if (!acc[plant]) acc[plant] = [];
            acc[plant].push(it);
            return acc;
        }, {});

        // Sum installed capacity for each plant (taking the last value for each plant)
        const plantData = {};
        for (const [plant, recs] of Object.entries(plantGroups)) {
            // Take the last record for installed capacity
            const lastRecord = recs[recs.length - 1];
            const installedCapacity = parseFloat(lastRecord.InstalledCapacity || 0);
            const availableCapacity = parseFloat(lastRecord.AvgAvailableCapacity || 0);
            plantData[plant] = { 
                installed: installedCapacity, 
                available: availableCapacity 
            };
        }

        // Calculate overall values
        const overallInstalled = Object.values(plantData).reduce((sum, pd) => sum + pd.installed, 0);
        const overallAvailable = Object.values(plantData).reduce((sum, pd) => sum + pd.available, 0);

        return { 
            year: parseInt(year), 
            source,
            overall: { 
                installed: overallInstalled, 
                available: overallAvailable 
            }, 
            byPlant: plantData 
        };
    });
    
    return yearly.sort((a, b) => a.year - b.year);
};

const computeCapacityMonthly = (data) => {
    const groups = data.filter(item => item.Month_Name !== null).reduce((acc, item) => {
        const key = `${item.Year}-${item.Month_Name}_${item.Source}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const monthly = Object.entries(groups).map(([yearMonthSource, items]) => {
        const [yearMonth, source] = yearMonthSource.split('_');
        const [year, month] = yearMonth.split('-');

        // Group by plant to avoid double counting
        const plantGroups = items.reduce((acc, it) => {
            const plant = it.Plant;
            if (!acc[plant]) acc[plant] = [];
            acc[plant].push(it);
            return acc;
        }, {});

        // Sum installed capacity for each plant (taking the last value for each plant)
        const plantData = {};
        for (const [plant, recs] of Object.entries(plantGroups)) {
            const lastRecord = recs[recs.length - 1];
            const installedCapacity = parseFloat(lastRecord.InstalledCapacity || 0);
            const availableCapacity = parseFloat(lastRecord.AvgAvailableCapacity || 0);
            plantData[plant] = { 
                installed: installedCapacity, 
                available: availableCapacity 
            };
        }

        // Calculate overall values
        const overallInstalled = Object.values(plantData).reduce((sum, pd) => sum + pd.installed, 0);
        const overallAvailable = Object.values(plantData).reduce((sum, pd) => sum + pd.available, 0);

        return { 
            year: parseInt(year), 
            month, 
            source,
            overall: { 
                installed: overallInstalled, 
                available: overallAvailable 
            }, 
            byPlant: plantData 
        };
    });

    return monthly.sort((a, b) => a.year - b.year || a.month.localeCompare(b.month));
};

const formatGencoCapacityData = (data) => {
    const sources = Array.from(new Set(data.map(it => it.Source)));
    const bySourceYearly = {};
    const bySourceMonthly = {};
    
    sources.forEach(source => {
        const filtered = data.filter(item => item.Source === source);
        bySourceYearly[source] = computeCapacityYearly(filtered);
        bySourceMonthly[source] = computeCapacityMonthly(filtered);
    });

    // Compute overall totals across all sources
    const overallYearly = computeCapacityYearly(data);
    const overallMonthly = computeCapacityMonthly(data);
    
    const uniquePlants = Array.from(new Set(data.map(it => it.Plant)));
    
    return {
        yearly: overallYearly,
        monthly: overallMonthly,
        plants: uniquePlants,
        sources,
        variants: {
            default: 'Installed Capacity (Mw)',
            options: ['Installed Capacity (Mw)', 'Avg. Available Capacity (Mw)']
        },
        bySource: {
            yearly: bySourceYearly,
            monthly: bySourceMonthly
        },
        raw: data
    };
};

const formatEnergySentData = (yearlyData, monthlyData) => {
    const yearlyGroups = yearlyData.reduce((acc, item) => {
        const year = item.Year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(item);
        return acc;
    }, {});

    const yearlyFormatted = Object.entries(yearlyGroups).map(([year, items]) => {
        const values = {};
        items.forEach(item => {
            values[item.Energy_Source] = Number(item.YearlyAvgEnergy);
        });
        return { year: parseInt(year), values };
    });

    const monthlyGroups = monthlyData.reduce((acc, item) => {
        const key = `${item.Year}-${item.Month_Name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const monthlyFormatted = Object.entries(monthlyGroups).map(([yearMonth, items]) => {
        const [year, month] = yearMonth.split('-');
        const values = {};
        items.forEach(item => {
            values[item.Energy_Source] = Number(item.Total_Energy);
        });
        return { year: parseInt(year), month, values };
    });

    const sources = Array.from(new Set(yearlyData.map(item => item.Energy_Source)));
    return {
        yearly: yearlyFormatted.sort((a, b) => a.year - b.year),
        monthly: monthlyFormatted.sort((a, b) => a.year - b.year || a.month.localeCompare(b.month)),
        sources,
        defaultSource: 'THERMAL'
    };
};

const formatGencoEnergyData = (data) => {
    const yearlyGroups = data.reduce((acc, item) => {
        const year = item.Year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(item);
        return acc;
    }, {});

    const yearlyFormatted = Object.entries(yearlyGroups).map(([year, items]) => {
        const total = items.reduce((sum, item) => sum + Number(item.EnergyGenerated), 0);
        const gencoGroups = items.reduce((acc, item) => {
            const genco = item.Genco;
            if (!acc[genco]) acc[genco] = 0;
            acc[genco] += Number(item.EnergyGenerated);
            return acc;
        }, {});
        return { year: parseInt(year), total, gencos: gencoGroups };
    });

    const gencos = Array.from(new Set(data.map(item => item.Genco)));
    return {
        yearly: yearlyFormatted.sort((a, b) => a.year - b.year),
        gencos
    };
};

export const fetchMetricsData4 = async () => {
    try {
        const [
            capacityResponse,
            energySentYearlyResponse,
            energySentMonthlyResponse,
            gencoEnergyResponse
        ] = await Promise.all([
            axios.get(`${API_URL}/installed-vs-available-capacity`),
            axios.get(`${API_URL}/yearly-Energy-Sentout`),
            axios.get(`${API_URL}/Monthly-Energy-Sentout`),
            axios.get(`${API_URL}/genco-energy-generated`)
        ]);

        const capacityData = capacityResponse.data;
        const energySentYearlyData = energySentYearlyResponse.data;
        const energySentMonthlyData = energySentMonthlyResponse.data;
        const gencoEnergyData = gencoEnergyResponse.data;

        const formattedCapacity = formatGencoCapacityData(capacityData);
        const formattedEnergySent = formatEnergySentData(energySentYearlyData, energySentMonthlyData);
        const formattedGencoEnergy = formatGencoEnergyData(gencoEnergyData);

        const yearsSet = new Set([
            ...formattedCapacity.yearly.map(item => item.year),
            ...formattedEnergySent.yearly.map(item => item.year),
            ...formattedGencoEnergy.yearly.map(item => item.year)
        ]);
        const years = Array.from(yearsSet).sort((a, b) => a - b);

        return {
            capacity: formattedCapacity,
            energySent: formattedEnergySent,
            gencoEnergy: formattedGencoEnergy,
            years
        };
    } catch (error) {
        console.error('Error fetching capacity metrics data:', error);
        throw error;
    }
};

export default {
    fetchMetricsData4
};