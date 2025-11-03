import React, { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../App';
import { Issue, IssueStatus, Priority } from '../../types';

declare const L: any;

const getStatusHexColor = (status: IssueStatus) => {
    switch (status) {
        case 'Submitted': return '#6B7280';
        case 'Acknowledged': return '#3B82F6';
        case 'In Progress': return '#EAB308';
        case 'Resolved': return '#22C55E';
        case 'Rejected': return '#EF4444';
        default: return '#6B7280';
    }
};

const getPriorityHexColor = (priority: Priority) => {
    switch (priority) {
        case 'High': return '#EF4444';
        case 'Medium': return '#EAB308';
        case 'Low': return '#22C55E';
        default: return '#6B7280';
    }
};

interface MapComponentProps {
    issues: Issue[];
    center?: [number, number];
    zoom?: number;
    markerStyle: 'priority' | 'status';
    onMarkerClick?: (issueId: string) => void;
    height: string;
    showHeatmap?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
    issues,
    center = [23.3441, 85.3096], // Default to Ranchi
    zoom = 12,
    markerStyle,
    onMarkerClick,
    height,
    showHeatmap = false
}) => {
    const { theme } = useContext(AppContext);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const heatmapLayerRef = useRef<any>(null);

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: center,
                zoom: zoom,
            });
        }
    }, []);

    // Update tile layer based on theme
    useEffect(() => {
        if (!mapRef.current) return;

        const tileUrl = theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
        
        if (tileLayerRef.current) {
            tileLayerRef.current.setUrl(tileUrl);
        } else {
            tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(mapRef.current);
        }
    }, [theme]);

    // Update markers and heatmap
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Clear heatmap
        if (heatmapLayerRef.current) {
            heatmapLayerRef.current.remove();
            heatmapLayerRef.current = null;
        }

        if (showHeatmap) {
            const heatData = issues.map(issue => [issue.location.lat, issue.location.lng, 1]); // intensity 1
            heatmapLayerRef.current = (L as any).heatLayer(heatData, { radius: 25 }).addTo(mapRef.current);
        } else {
            issues.forEach(issue => {
                const color = markerStyle === 'priority' ? getPriorityHexColor(issue.priority) : getStatusHexColor(issue.status);
                
                const icon = L.divIcon({
                    html: `<i class="fas fa-map-marker-alt" style="color: ${color}; font-size: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"></i>`,
                    className: 'border-0 bg-transparent',
                    iconSize: [30, 42],
                    iconAnchor: [15, 42],
                });

                const marker = L.marker([issue.location.lat, issue.location.lng], { icon })
                    .addTo(mapRef.current)
                    .bindPopup(`
                        <div class="text-sm">
                            <img src="${issue.imageUrl}" alt="${issue.title}" class="w-full h-24 object-cover rounded-t-md mb-2" />
                            <div class="p-1">
                                <p class="font-bold">${issue.title}</p>
                                <p class="text-gray-600">${issue.category}</p>
                                <p class="text-gray-500 text-xs">${issue.location.address}</p>
                            </div>
                        </div>
                    `, { minWidth: 200 });

                if (onMarkerClick) {
                    marker.on('click', (e: any) => {
                        onMarkerClick(issue.id);
                        // L.DomEvent.stopPropagation(e);
                    });
                }
                markersRef.current.push(marker);
            });
        }
    }, [issues, markerStyle, onMarkerClick, showHeatmap]);

    return <div ref={mapContainerRef} style={{ height }} className="w-full rounded-lg shadow-md z-0" />;
};

export default MapComponent;
