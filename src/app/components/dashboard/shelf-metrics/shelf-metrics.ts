import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShelfMetricsService, ShelfMetric } from '../../services/shelf-metrics.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shelf-metrics',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './shelf-metrics.html',
  styleUrls: ['./shelf-metrics.css']
})
export class ShelfMetricsComponent implements OnInit {
  metrics: ShelfMetric[] = [];
  isLoading = false;

  showDeleteModal = false;
  pendingDeleteId: number | null = null;
  pendingDeleteCode = '';

  filterText = '';
  sortColumn: keyof ShelfMetric = 'shelfCode';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 5;

  constructor(
    private metricsService: ShelfMetricsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  loadMetrics(): void {
    this.isLoading = true;
    this.metricsService.getShelfMetrics().subscribe({
      next: res => {
        this.metrics = res.data ?? [];
        this.toastr.info(`Loaded ${this.metrics.length} shelf metrics.`, 'Info');
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load shelf metrics.', 'Error');
        this.isLoading = false;
      }
    });
  }

  get filteredMetrics(): ShelfMetric[] {
    const text = this.filterText.trim().toLowerCase();
    return this.metrics
      .filter(m =>
        m.shelfCode.toLowerCase().includes(text) ||
        m.totalCapacity.toString().includes(text) ||
        m.currentStock.toString().includes(text) ||
        m.occupancyPercentage.toString().includes(text) ||
        m.totalProductsAssigned.toString().includes(text) ||
        m.restockCountLast30Days.toString().includes(text) ||
        m.averageDaysBetweenRestocks.toString().includes(text)
      )
      .sort((a, b) => {
        const aVal = (a[this.sortColumn] ?? '').toString().toLowerCase();
        const bVal = (b[this.sortColumn] ?? '').toString().toLowerCase();
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
  }

  get paginatedMetrics(): ShelfMetric[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMetrics.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMetrics.length / this.pageSize);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  sortBy(column: keyof ShelfMetric): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  openDeleteModal(id: number, code: string): void {
    this.pendingDeleteId = id;
    this.pendingDeleteCode = code;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteCode = '';
    this.showDeleteModal = false;
  }

   
}
