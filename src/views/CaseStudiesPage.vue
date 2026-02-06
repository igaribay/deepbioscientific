<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'

// 3Dmol viewer references
const viewerRefs = ref<(HTMLElement | null)[]>([])
let viewers: any[] = []
let initialViews: any[] = []

// Sample PDB data for discovered peptides (simplified representations)
const peptidePDBData = {
  glp1: `HEADER    PEPTIDE HORMONE                        01-JAN-25   XXXX
TITLE     GLP-1 AGONIST OPTIMIZED BY DEEPBIO SCIENTIFIC AI
ATOM      1  N   HIS A   1       0.000   0.000   0.000  1.00 20.00           N
ATOM      2  CA  HIS A   1       1.458   0.000   0.000  1.00 20.00           C
ATOM      3  C   HIS A   1       2.009   1.420   0.000  1.00 20.00           C
ATOM      4  O   HIS A   1       1.251   2.390   0.000  1.00 20.00           O
ATOM      5  CB  HIS A   1       1.990  -0.771   1.219  1.00 20.00           C
ATOM      6  N   ALA A   2       3.327   1.542   0.000  1.00 20.00           N
ATOM      7  CA  ALA A   2       3.974   2.851   0.000  1.00 20.00           C
ATOM      8  C   ALA A   2       5.481   2.726  -0.156  1.00 20.00           C
ATOM      9  O   ALA A   2       6.032   1.622  -0.266  1.00 20.00           O
ATOM     10  CB  ALA A   2       3.643   3.688   1.234  1.00 20.00           C
ATOM     11  N   GLU A   3       6.128   3.894  -0.156  1.00 20.00           N
ATOM     12  CA  GLU A   3       7.577   3.970  -0.306  1.00 20.00           C
ATOM     13  C   GLU A   3       8.094   5.394  -0.156  1.00 20.00           C
ATOM     14  O   GLU A   3       7.299   6.338  -0.054  1.00 20.00           O
ATOM     15  CB  GLU A   3       8.252   3.062  -1.338  1.00 20.00           C
ATOM     16  N   GLY A   4       9.410   5.545  -0.156  1.00 20.00           N
ATOM     17  CA  GLY A   4      10.024   6.867  -0.007  1.00 20.00           C
ATOM     18  C   GLY A   4      11.534   6.766   0.106  1.00 20.00           C
ATOM     19  O   GLY A   4      12.077   5.662   0.216  1.00 20.00           O
ATOM     20  N   THR A   5      12.193   7.925   0.095  1.00 20.00           N
ATOM     21  CA  THR A   5      13.641   7.973   0.201  1.00 20.00           C
ATOM     22  C   THR A   5      14.147   9.396   0.095  1.00 20.00           C
ATOM     23  O   THR A   5      13.343  10.329  -0.015  1.00 20.00           O
ATOM     24  CB  THR A   5      14.317   7.039   1.209  1.00 20.00           C
ATOM     25  N   PHE A   6      15.463   9.549   0.095  1.00 20.00           N
ATOM     26  CA  PHE A   6      16.066  10.874   0.000  1.00 20.00           C
ATOM     27  C   PHE A   6      17.576  10.753  -0.156  1.00 20.00           C
ATOM     28  O   PHE A   6      18.127   9.649  -0.266  1.00 20.00           O
ATOM     29  CB  PHE A   6      15.735  11.775   1.178  1.00 20.00           C
ATOM     30  N   THR A   7      18.224  11.921  -0.156  1.00 20.00           N
ATOM     31  CA  THR A   7      19.672  12.027  -0.301  1.00 20.00           C
ATOM     32  C   THR A   7      20.189  13.451  -0.156  1.00 20.00           C
ATOM     33  O   THR A   7      19.395  14.395  -0.054  1.00 20.00           O
ATOM     34  CB  THR A   7      20.347  11.093   1.209  1.00 20.00           C
ATOM     35  N   SER A   8      21.505  13.602  -0.156  1.00 20.00           N
ATOM     36  CA  SER A   8      22.119  14.924  -0.007  1.00 20.00           C
ATOM     37  C   SER A   8      23.629  14.823   0.106  1.00 20.00           C
ATOM     38  O   SER A   8      24.171  13.719   0.216  1.00 20.00           O
ATOM     39  CB  SER A   8      21.788  15.825   1.178  1.00 20.00           C
ATOM     40  N   ASP A   9      24.288  15.982   0.095  1.00 20.00           N
ATOM     41  CA  ASP A   9      25.736  16.088   0.201  1.00 20.00           C
ATOM     42  C   ASP A   9      26.242  17.510   0.095  1.00 20.00           C
ATOM     43  O   ASP A   9      25.438  18.444  -0.015  1.00 20.00           O
ATOM     44  CB  ASP A   9      26.412  15.180  -0.838  1.00 20.00           C
ATOM     45  N   VAL A  10      27.558  17.663   0.095  1.00 20.00           N
ATOM     46  CA  VAL A  10      28.161  18.988   0.000  1.00 20.00           C
ATOM     47  C   VAL A  10      29.671  18.867  -0.156  1.00 20.00           C
ATOM     48  O   VAL A  10      30.222  17.763  -0.266  1.00 20.00           O
ATOM     49  CB  VAL A  10      27.830  19.889   1.178  1.00 20.00           C
END`,

  proteinBinder: `HEADER    PROTEIN BINDER                         01-JAN-25   YYYY
TITLE     DE NOVO PROTEIN BINDER - ONCOLOGY TARGET
ATOM      1  N   MET A   1       0.000   0.000   0.000  1.00 15.00           N
ATOM      2  CA  MET A   1       1.458   0.000   0.000  1.00 15.00           C
ATOM      3  C   MET A   1       2.009   1.420   0.000  1.00 15.00           C
ATOM      4  O   MET A   1       1.251   2.390   0.000  1.00 15.00           O
ATOM      5  CB  MET A   1       1.990  -0.771   1.219  1.00 15.00           C
ATOM      6  N   ARG A   2       3.327   1.542   0.000  1.00 15.00           N
ATOM      7  CA  ARG A   2       3.974   2.851   0.000  1.00 15.00           C
ATOM      8  C   ARG A   2       5.481   2.726  -0.156  1.00 15.00           C
ATOM      9  O   ARG A   2       6.032   1.622  -0.266  1.00 15.00           O
ATOM     10  CB  ARG A   2       3.643   3.688   1.234  1.00 15.00           C
ATOM     11  N   TRP A   3       6.128   3.894  -0.156  1.00 15.00           N
ATOM     12  CA  TRP A   3       7.577   3.970  -0.306  1.00 15.00           C
ATOM     13  C   TRP A   3       8.094   5.394  -0.156  1.00 15.00           C
ATOM     14  O   TRP A   3       7.299   6.338  -0.054  1.00 15.00           O
ATOM     15  CB  TRP A   3       8.252   3.062   0.738  1.00 15.00           C
ATOM     16  N   LYS A   4       9.410   5.545  -0.156  1.00 15.00           N
ATOM     17  CA  LYS A   4      10.024   6.867  -0.007  1.00 15.00           C
ATOM     18  C   LYS A   4      11.534   6.766   0.106  1.00 15.00           C
ATOM     19  O   LYS A   4      12.077   5.662   0.216  1.00 15.00           O
ATOM     20  CB  LYS A   4      9.693   7.768   1.178  1.00 15.00           C
ATOM     21  N   LEU A   5      12.193   7.925   0.095  1.00 15.00           N
ATOM     22  CA  LEU A   5      13.641   7.973   0.201  1.00 15.00           C
ATOM     23  C   LEU A   5      14.147   9.396   0.095  1.00 15.00           C
ATOM     24  O   LEU A   5      13.343  10.329  -0.015  1.00 15.00           O
ATOM     25  CB  LEU A   5      14.317   7.039  -0.838  1.00 15.00           C
ATOM     26  N   ASN A   6      15.463   9.549   0.095  1.00 15.00           N
ATOM     27  CA  ASN A   6      16.066  10.874   0.000  1.00 15.00           C
ATOM     28  C   ASN A   6      17.576  10.753  -0.156  1.00 15.00           C
ATOM     29  O   ASN A   6      18.127   9.649  -0.266  1.00 15.00           O
ATOM     30  CB  ASN A   6      15.735  11.775   1.178  1.00 15.00           C
ATOM     31  N   GLN A   7      18.224  11.921  -0.156  1.00 15.00           N
ATOM     32  CA  GLN A   7      19.672  12.027  -0.301  1.00 15.00           C
ATOM     33  C   GLN A   7      20.189  13.451  -0.156  1.00 15.00           C
ATOM     34  O   GLN A   7      19.395  14.395  -0.054  1.00 15.00           O
ATOM     35  CB  GLN A   7      20.347  11.093   0.738  1.00 15.00           C
ATOM     36  N   CYS A   8      21.505  13.602  -0.156  1.00 15.00           N
ATOM     37  CA  CYS A   8      22.119  14.924  -0.007  1.00 15.00           C
ATOM     38  C   CYS A   8      23.629  14.823   0.106  1.00 15.00           C
ATOM     39  O   CYS A   8      24.171  13.719   0.216  1.00 15.00           O
ATOM     40  CB  CYS A   8      21.788  15.825   1.178  1.00 15.00           C
ATOM     41  SG  CYS A   8      22.350  15.150   2.800  1.00 15.00           S
END`,

  // CMP-Neu5Ac (Cytidine-5'-monophospho-N-acetylneuraminic acid) - Small molecule structure
  cmpNeu5Ac: `HEADER    SMALL MOLECULE - CMP-NEU5AC              01-JAN-25   CMNA
TITLE     CYTIDINE-5-MONOPHOSPHO-N-ACETYLNEURAMINIC ACID - COVID-19 INHIBITOR
HETATM    1  C1  CMN A   1       0.000   0.000   0.000  1.00 20.00           C
HETATM    2  C2  CMN A   1       1.400   0.000   0.500  1.00 20.00           C
HETATM    3  O2  CMN A   1       1.600   1.200   1.200  1.00 20.00           O
HETATM    4  C3  CMN A   1       2.400  -0.200  -0.600  1.00 20.00           C
HETATM    5  O3  CMN A   1       2.200  -1.400  -1.300  1.00 20.00           O
HETATM    6  C4  CMN A   1       3.800   0.000  -0.100  1.00 20.00           C
HETATM    7  O4  CMN A   1       4.000   1.400   0.100  1.00 20.00           O
HETATM    8  C5  CMN A   1       4.800  -0.600  -1.000  1.00 20.00           C
HETATM    9  N5  CMN A   1       4.600  -2.000  -1.200  1.00 20.00           N
HETATM   10  C10 CMN A   1       5.400  -2.800  -2.000  1.00 20.00           C
HETATM   11  O10 CMN A   1       6.400  -2.400  -2.600  1.00 20.00           O
HETATM   12  C11 CMN A   1       5.000  -4.200  -2.200  1.00 20.00           C
HETATM   13  C6  CMN A   1       6.200  -0.200  -0.500  1.00 20.00           C
HETATM   14  O6  CMN A   1       6.400   1.200  -0.300  1.00 20.00           O
HETATM   15  C7  CMN A   1       7.200  -0.800  -1.400  1.00 20.00           C
HETATM   16  O7  CMN A   1       7.000  -2.200  -1.600  1.00 20.00           O
HETATM   17  C8  CMN A   1       8.600  -0.400  -0.900  1.00 20.00           C
HETATM   18  O8  CMN A   1       8.800   1.000  -0.700  1.00 20.00           O
HETATM   19  C9  CMN A   1       9.600  -1.000  -1.800  1.00 20.00           C
HETATM   20  O9  CMN A   1       9.400  -2.400  -2.000  1.00 20.00           O
HETATM   21  P   CMN A   1      -1.200   0.600   0.800  1.00 20.00           P
HETATM   22  O1P CMN A   1      -1.000   2.000   1.200  1.00 20.00           O
HETATM   23  O2P CMN A   1      -2.400   0.400   0.000  1.00 20.00           O
HETATM   24  O3P CMN A   1      -1.400  -0.200   2.000  1.00 20.00           O
HETATM   25  C1R CMN A   1      -3.600   0.800  -0.600  1.00 20.00           C
HETATM   26  C2R CMN A   1      -4.600   1.600   0.200  1.00 20.00           C
HETATM   27  O2R CMN A   1      -4.400   3.000   0.000  1.00 20.00           O
HETATM   28  C3R CMN A   1      -6.000   1.200  -0.200  1.00 20.00           C
HETATM   29  O3R CMN A   1      -6.200  -0.200  -0.400  1.00 20.00           O
HETATM   30  C4R CMN A   1      -7.000   1.800   0.700  1.00 20.00           C
HETATM   31  O4R CMN A   1      -3.800   1.400  -1.800  1.00 20.00           O
HETATM   32  N1  CMN A   1      -8.400   1.400   0.300  1.00 20.00           N
HETATM   33  C2N CMN A   1      -9.400   2.200   0.800  1.00 20.00           C
HETATM   34  O2N CMN A   1      -9.200   3.200   1.500  1.00 20.00           O
HETATM   35  N3  CMN A   1     -10.600   1.800   0.400  1.00 20.00           N
HETATM   36  C4N CMN A   1     -10.800   0.600  -0.200  1.00 20.00           C
HETATM   37  N4  CMN A   1     -12.000   0.200  -0.600  1.00 20.00           N
HETATM   38  C5N CMN A   1      -9.800  -0.200  -0.600  1.00 20.00           C
HETATM   39  C6N CMN A   1      -8.600   0.200  -0.200  1.00 20.00           C
END`,

  mrnaVaccine: `HEADER    mRNA CONSTRUCT                          01-JAN-25   ZZZZ
TITLE     NEOANTIGEN PEPTIDE FOR CANCER VACCINE
ATOM      1  N   ALA A   1       0.000   0.000   0.000  1.00 25.00           N
ATOM      2  CA  ALA A   1       1.458   0.000   0.000  1.00 25.00           C
ATOM      3  C   ALA A   1       2.009   1.420   0.000  1.00 25.00           C
ATOM      4  O   ALA A   1       1.251   2.390   0.000  1.00 25.00           O
ATOM      5  CB  ALA A   1       1.990  -0.771   1.219  1.00 25.00           C
ATOM      6  N   ILE A   2       3.327   1.542   0.000  1.00 25.00           N
ATOM      7  CA  ILE A   2       3.974   2.851   0.000  1.00 25.00           C
ATOM      8  C   ILE A   2       5.481   2.726  -0.156  1.00 25.00           C
ATOM      9  O   ILE A   2       6.032   1.622  -0.266  1.00 25.00           O
ATOM     10  CB  ILE A   2       3.643   3.688   1.234  1.00 25.00           C
ATOM     11  N   TYR A   3       6.128   3.894  -0.156  1.00 25.00           N
ATOM     12  CA  TYR A   3       7.577   3.970  -0.306  1.00 25.00           C
ATOM     13  C   TYR A   3       8.094   5.394  -0.156  1.00 25.00           C
ATOM     14  O   TYR A   3       7.299   6.338  -0.054  1.00 25.00           O
ATOM     15  CB  TYR A   3       8.252   3.062   0.738  1.00 25.00           C
ATOM     16  N   PHE A   4       9.410   5.545  -0.156  1.00 25.00           N
ATOM     17  CA  PHE A   4      10.024   6.867  -0.007  1.00 25.00           C
ATOM     18  C   PHE A   4      11.534   6.766   0.106  1.00 25.00           C
ATOM     19  O   PHE A   4      12.077   5.662   0.216  1.00 25.00           O
ATOM     20  CB  PHE A   4       9.693   7.768   1.178  1.00 25.00           C
ATOM     21  N   PRO A   5      12.193   7.925   0.095  1.00 25.00           N
ATOM     22  CA  PRO A   5      13.641   7.973   0.201  1.00 25.00           C
ATOM     23  C   PRO A   5      14.147   9.396   0.095  1.00 25.00           C
ATOM     24  O   PRO A   5      13.343  10.329  -0.015  1.00 25.00           O
ATOM     25  CB  PRO A   5      14.317   7.039  -0.838  1.00 25.00           C
ATOM     26  N   GLU A   6      15.463   9.549   0.095  1.00 25.00           N
ATOM     27  CA  GLU A   6      16.066  10.874   0.000  1.00 25.00           C
ATOM     28  C   GLU A   6      17.576  10.753  -0.156  1.00 25.00           C
ATOM     29  O   GLU A   6      18.127   9.649  -0.266  1.00 25.00           O
ATOM     30  CB  GLU A   6      15.735  11.775   1.178  1.00 25.00           C
ATOM     31  N   LYS A   7      18.224  11.921  -0.156  1.00 25.00           N
ATOM     32  CA  LYS A   7      19.672  12.027  -0.301  1.00 25.00           C
ATOM     33  C   LYS A   7      20.189  13.451  -0.156  1.00 25.00           C
ATOM     34  O   LYS A   7      19.395  14.395  -0.054  1.00 25.00           O
ATOM     35  CB  LYS A   7      20.347  11.093   0.738  1.00 25.00           C
ATOM     36  N   VAL A   8      21.505  13.602  -0.156  1.00 25.00           N
ATOM     37  CA  VAL A   8      22.119  14.924  -0.007  1.00 25.00           C
ATOM     38  C   VAL A   8      23.629  14.823   0.106  1.00 25.00           C
ATOM     39  O   VAL A   8      24.171  13.719   0.216  1.00 25.00           O
ATOM     40  CB  VAL A   8      21.788  15.825   1.178  1.00 25.00           C
END`,

  // GPR-139 Selective Agonist - De Novo Design (AlphaFold predicted structure)
  gpr139Binder: `HEADER    GPR-139 SELECTIVE AGONIST                01-JAN-25   GPR1
TITLE     DE NOVO GPR-139 BINDER - ALPHAFOLD PREDICTED STRUCTURE
ATOM      1  N   VAL A   1     -32.179   9.477 -24.112  1.00 76.87           N
ATOM      2  CA  VAL A   1     -30.753   9.821 -24.348  1.00 86.25           C
ATOM      3  C   VAL A   1     -30.065  10.338 -23.080  1.00 86.86           C
ATOM      4  O   VAL A   1     -29.012   9.816 -22.734  1.00 85.12           O
ATOM      5  N   ALA A   2     -30.679  11.262 -22.331  1.00 84.53           N
ATOM      6  CA  ALA A   2     -30.104  11.788 -21.082  1.00 89.39           C
ATOM      7  C   ALA A   2     -29.867  10.718 -19.995  1.00 90.46           C
ATOM      8  O   ALA A   2     -28.827  10.712 -19.349  1.00 88.18           O
ATOM      9  N   PHE A   3     -30.783   9.751 -19.827  1.00 89.25           N
ATOM     10  CA  PHE A   3     -30.658   8.664 -18.852  1.00 88.58           C
ATOM     11  C   PHE A   3     -29.439   7.762 -19.106  1.00 88.87           C
ATOM     12  O   PHE A   3     -28.699   7.441 -18.178  1.00 88.47           O
ATOM     13  N   VAL A   4     -29.169   7.394 -20.356  1.00 89.25           N
ATOM     14  CA  VAL A   4     -28.019   6.553 -20.737  1.00 89.08           C
ATOM     15  C   VAL A   4     -26.691   7.289 -20.504  1.00 88.63           C
ATOM     16  O   VAL A   4     -25.731   6.677 -20.053  1.00 88.62           O
ATOM     17  N   LYS A   5     -26.657   8.608 -20.747  1.00 90.16           N
ATOM     18  CA  LYS A   5     -25.476   9.448 -20.510  1.00 87.33           C
ATOM     19  C   LYS A   5     -25.121   9.530 -19.015  1.00 86.26           C
ATOM     20  O   LYS A   5     -23.980   9.258 -18.662  1.00 88.96           O
ATOM     21  N   ASN A   6     -26.114   9.747 -18.141  1.00 92.49           N
ATOM     22  CA  ASN A   6     -25.914   9.749 -16.684  1.00 91.99           C
ATOM     23  C   ASN A   6     -25.444   8.386 -16.156  1.00 92.64           C
ATOM     24  O   ASN A   6     -24.608   8.324 -15.261  1.00 92.53           O
ATOM     25  N   TRP A   7     -25.943   7.271 -16.712  1.00 91.40           N
ATOM     26  CA  TRP A   7     -25.491   5.930 -16.338  1.00 90.44           C
ATOM     27  C   TRP A   7     -24.031   5.670 -16.725  1.00 90.93           C
ATOM     28  O   TRP A   7     -23.287   5.105 -15.929  1.00 91.92           O
ATOM     29  N   LEU A   8     -23.608   6.122 -17.914  1.00 92.86           N
ATOM     30  CA  LEU A   8     -22.215   6.013 -18.366  1.00 92.19           C
ATOM     31  C   LEU A   8     -21.271   6.864 -17.511  1.00 92.28           C
ATOM     32  O   LEU A   8     -20.201   6.388 -17.145  1.00 93.72           O
ATOM     33  N   GLU A   9     -21.665   8.082 -17.125  1.00 91.30           N
ATOM     34  CA  GLU A   9     -20.890   8.952 -16.234  1.00 91.30           C
ATOM     35  C   GLU A   9     -20.765   8.344 -14.826  1.00 91.52           C
ATOM     36  O   GLU A   9     -19.672   8.332 -14.264  1.00 92.30           O
ATOM     37  N   PHE A  10     -21.835   7.760 -14.287  1.00 93.67           N
ATOM     38  CA  PHE A  10     -21.808   7.052 -13.007  1.00 92.09           C
ATOM     39  C   PHE A  10     -20.880   5.829 -13.042  1.00 92.33           C
ATOM     40  O   PHE A  10     -20.072   5.646 -12.133  1.00 92.92           O
ATOM     41  N   LEU A  11     -20.946   5.010 -14.097  1.00 93.90           N
ATOM     42  CA  LEU A  11     -20.047   3.864 -14.288  1.00 92.40           C
ATOM     43  C   LEU A  11     -18.587   4.296 -14.392  1.00 92.29           C
ATOM     44  O   LEU A  11     -17.724   3.682 -13.760  1.00 93.90           O
ATOM     45  N   ALA A  12     -18.293   5.364 -15.134  1.00 92.66           N
ATOM     46  CA  ALA A  12     -16.942   5.897 -15.270  1.00 91.62           C
ATOM     47  C   ALA A  12     -16.394   6.407 -13.929  1.00 91.38           C
ATOM     48  O   ALA A  12     -15.260   6.076 -13.565  1.00 90.63           O
ATOM     49  N   GLN A  13     -17.195   7.121 -13.137  1.00 94.44           N
ATOM     50  CA  GLN A  13     -16.812   7.569 -11.798  1.00 93.77           C
ATOM     51  C   GLN A  13     -16.609   6.397 -10.835  1.00 93.93           C
ATOM     52  O   GLN A  13     -15.632   6.379 -10.089  1.00 93.82           O
ATOM     53  N   TRP A  14     -17.471   5.376 -10.872  1.00 95.37           N
ATOM     54  CA  TRP A  14     -17.350   4.193 -10.031  1.00 94.49           C
END`
}

// COVID-19 Drug Repurposing Data from AttentionSite-Augmented DeepDTA
const drugRepurposingData = {
  'Spike-ACE2': [
    { drug: 'Oseltamivir phosphate', pIC50: 8.29, rankFDA: 42, rankAntiviral: 1 },
    { drug: 'Etravirine', pIC50: 8.22, rankFDA: 52, rankAntiviral: 2 },
    { drug: 'Fosamprenavir calcium', pIC50: 8.20, rankFDA: 57, rankAntiviral: 3 },
    { drug: 'Tipranavir', pIC50: 7.94, rankFDA: 108, rankAntiviral: 4 },
    { drug: 'Elvitegravir', pIC50: 7.88, rankFDA: 141, rankAntiviral: 5 },
  ],
  'Helicase': [
    { drug: 'Fosamprenavir calcium (FPV)', pIC50: 7.51, rankFDA: 21, rankAntiviral: 1 },
    { drug: 'Simeprevir', pIC50: 7.47, rankFDA: 24, rankAntiviral: 2 },
    { drug: 'Elvitegravir', pIC50: 7.28, rankFDA: 52, rankAntiviral: 3 },
    { drug: 'Simeprevir sodium', pIC50: 7.11, rankFDA: 87, rankAntiviral: 4 },
    { drug: 'Ritonavir', pIC50: 7.01, rankFDA: 120, rankAntiviral: 6 },
  ],
  '3C-like': [
    { drug: 'Fosamprenavir calcium', pIC50: 7.72, rankFDA: 5, rankAntiviral: 1 },
    { drug: 'Elvitegravir', pIC50: 7.25, rankFDA: 29, rankAntiviral: 2 },
    { drug: 'Tipranavir', pIC50: 7.17, rankFDA: 37, rankAntiviral: 3 },
    { drug: 'Asunaprevir', pIC50: 7.08, rankFDA: 46, rankAntiviral: 4 },
    { drug: 'Atazanavir sulfate', pIC50: 6.92, rankFDA: 68, rankAntiviral: 6 },
  ],
  'RdRp': [
    { drug: 'Elvitegravir', pIC50: 7.60, rankFDA: 8, rankAntiviral: 1 },
    { drug: 'Fosamprenavir calcium', pIC50: 7.24, rankFDA: 24, rankAntiviral: 2 },
    { drug: 'Ritonavir', pIC50: 6.96, rankFDA: 53, rankAntiviral: 3 },
    { drug: 'Asunaprevir', pIC50: 6.90, rankFDA: 66, rankAntiviral: 4 },
    { drug: 'Simeprevir sodium', pIC50: 6.87, rankFDA: 71, rankAntiviral: 5 },
  ],
}

const caseStudies = [
  {
    id: 1,
    title: 'COVID-19 Drug Discovery: CMP-Neu5Ac',
    partner: 'University Lab',
    category: 'Antiviral Discovery',
    sequence: 'CC(=O)N[C@@H]1[C@@H](O)C[C@@](OC2O[C@H](COP(O)(=O)O)[C@@H](O)[C@H]2O)(C(O)=O)O[C@H]1[C@H](O)[C@H](O)CO',
    moleculeType: 'smallMolecule',
    description: 'Identified Cytidine-5\'-monophospho-N-acetylneuraminic acid sodium salt (CMP-Neu5Ac) as a SARS-CoV-2 Spike Protein inhibitor through AI-driven molecular docking. Wet lab validated by University Materials Science Lab.',
    results: [
      { metric: 'Validated', label: 'Wet Lab Confirmation' },
      { metric: 'Spike RBD', label: 'Target Binding Site' },
      { metric: 'In Vitro', label: 'Confirmed Inhibition' },
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-blue-500',
    pdbKey: 'cmpNeu5Ac',
    viewerStyle: { stick: { colorscheme: 'purpleCarbon', radius: 0.2 }, sphere: { colorscheme: 'Jmol', scale: 0.25 } }
  },
  {
    id: 2,
    title: 'COVID-19 Drug Repurposing: FDA-Approved Antivirals',
    partner: 'AttentionSite-Augmented DeepDTA',
    category: 'Drug Repurposing',
    sequence: '',
    moleculeType: 'drugTable',
    description: 'Top FDA-approved antiviral drugs predicted by AttentionSite-Augmented DeepDTA model to have highest affinity scores with 4 SARS-CoV-2 genome sequences. Identified candidates like Fosamprenavir, Elvitegravir, and Ritonavir as potential COVID-19 treatments.',
    results: [
      { metric: '3416', label: 'FDA Drugs Screened' },
      { metric: '4', label: 'Viral Targets' },
      { metric: '85', label: 'Antivirals Ranked' },
    ],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    pdbKey: null,
    viewerStyle: null
  },
  {
    id: 3,
    title: 'GPR-139 Selective Agonist: De Novo Design',
    partner: 'DeepBio Scientific AI Platform',
    category: 'De Novo Peptide Design',
    sequence: 'VAFVKNWLEFLAQWVASRLVNHQIGLQQELQIVAQAVLRYHQAETAKLSYTLAN',
    moleculeType: 'peptide',
    description: 'De novo designed GPR-139 selective agonist with 40% better predicted binding score than Dynorphin. Unlike RFDiffusion (21% structural similarity), our design achieves 0% similarity to existing proteins, enabling optimization to avoid off-target binding to opioid receptors (OPRM, OPRK, OPRD).',
    results: [
      { metric: '+40%', label: 'Better Binding vs Dynorphin' },
      { metric: '0%', label: 'Structural Similarity' },
      { metric: 'Zero', label: 'Off-Target Opioid Binding' },
    ],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    pdbKey: 'gpr139Binder',
    viewerStyle: { cartoon: { color: 'spectrum' }, stick: { colorscheme: 'orangeCarbon', radius: 0.15 } }
  },
  {
    id: 4,
    title: 'Equi-mRNA: mRNA Expression & Stability Prediction',
    partner: 'NeurIPS 2025 Publication',
    category: 'mRNA Language Model',
    sequence: 'AUG·GCU·GAA·UGC·AAA·GGU·CUG·UAC·CAG·UUG·...',
    moleculeType: 'mrnaVisualization',
    description: 'Equi-mRNA is the first codon-level equivariant mRNA language model that explicitly encodes synonymous codon symmetries using SO(2) group theory. With only 15M parameters, it outperforms models 100x larger across multiple mRNA benchmarks.',
    results: [
      { metric: '0.855', label: 'Best mRFP Score' },
      { metric: '0.764', label: 'Best Tc-Ribo Score' },
      { metric: '15M', label: 'Parameters (vs 1.6B)' },
    ],
    color: 'cyan',
    gradient: 'from-cyan-500 to-purple-500',
    pdbKey: null,
    viewerStyle: null
  },
]

// const testimonials = [
//   {
//     quote: "DeepBio Scientific's platform accelerated our peptide program by over a year. The quality of candidates exceeded our expectations.",
//     author: 'VP of Discovery',
//     company: 'Top 10 Pharma',
//     image: '/team/testimonial-1.jpg',
//   },
//   {
//     quote: "The ability to specify our therapeutic goals in natural language and get optimized candidates back is transformative.",
//     author: 'CSO',
//     company: 'Clinical-Stage Biotech',
//     image: '/team/testimonial-2.jpg',
//   },
// ]

const selectedPeptide = ref<number | null>(null)
const isViewerLoading = ref<boolean[]>([true, true, true, true])
const selectedTarget = ref<string>('Spike-ACE2')

async function initViewers() {
  // Dynamically import 3Dmol
  const $3Dmol = await import('3dmol')
  
  await nextTick()
  
  caseStudies.forEach((study, index) => {
    // Skip studies that don't have 3D viewers
    if (study.moleculeType === 'drugTable' || study.moleculeType === 'mrnaVisualization') {
      isViewerLoading.value[index] = false
      return
    }
    
    const container = viewerRefs.value[index]
    if (!container) return
    
    // Create viewer with dark background
    const viewer = $3Dmol.createViewer(container, {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      antialias: true,
    })
    
    // Add the PDB data
    const pdbData = peptidePDBData[study.pdbKey as keyof typeof peptidePDBData]
    viewer.addModel(pdbData, 'pdb')
    
    // Apply colorful styles based on case study and molecule type
    if (study.moleculeType === 'smallMolecule') {
      // Small molecule style - ball and stick representation
      viewer.setStyle({}, {
        stick: { colorscheme: 'purpleCarbon', radius: 0.2 },
        sphere: { colorscheme: 'Jmol', scale: 0.3 }
      })
      // Add transparent surface for small molecule
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.25,
        color: '#a855f7'
      })
    } else if (study.color === 'cyan') {
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { colorscheme: 'cyanCarbon', radius: 0.15 }
      })
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.15,
        color: '#22d3ee'
      })
    } else if (study.color === 'purple') {
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        sphere: { colorscheme: 'Jmol', scale: 0.25 }
      })
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.15,
        color: '#a855f7'
      })
    } else if (study.color === 'amber') {
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { colorscheme: 'orangeCarbon', radius: 0.15 }
      })
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.15,
        color: '#f59e0b'
      })
    } else {
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { colorscheme: 'orangeCarbon', radius: 0.15 }
      })
    viewer.addSurface($3Dmol.SurfaceType.VDW, {
      opacity: 0.15,
        color: '#ec4899'
    })
    }
    
    viewer.zoomTo()
    viewer.render()
    
    // Store the initial view state for reset functionality
    initialViews[index] = (viewer as any).getView()
    
    // Start auto-rotation
    viewer.spin('y', 0.5)
    
    viewers[index] = viewer
    isViewerLoading.value[index] = false
  })
}

function stopRotation(index: number) {
  if (viewers[index]) {
    viewers[index].spin(false)
  }
}

function startRotation(index: number) {
  if (viewers[index]) {
    viewers[index].spin('y', 0.5)
  }
}

function resetView(index: number) {
  const viewer = viewers[index]
  if (viewer) {
    // Stop any rotation
    viewer.spin(false)
    
    // Reset rotation using rotate method to set to identity
    // First zoom to default
    viewer.zoomTo()
    
    // Reset rotation by setting view with default quaternion [qw=1, qx=0, qy=0, qz=0]
    const currentView = (viewer as any).getView()
    if (currentView && Array.isArray(currentView)) {
      // View format: [x, y, z, zoom, qx, qy, qz, qw] - set quaternion to identity
      currentView[4] = 0  // qx
      currentView[5] = 0  // qy  
      currentView[6] = 0  // qz
      currentView[7] = 1  // qw (identity quaternion)
      ;(viewer as any).setView(currentView)
    }
    
    viewer.render()
  }
}

onMounted(() => {
  // Animate cards
  const cards = document.querySelectorAll('.case-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }
  
  // Animate hero elements
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )
  
  // Floating particles animation
  gsap.to('.floating-particle', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2
  })
  
  // Initialize 3D viewers
  initViewers()
})

onUnmounted(() => {
  viewers.forEach(viewer => {
    if (viewer) {
      viewer.spin(false)
    }
  })
  viewers = []
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <!-- Floating particles -->
      <div v-for="i in 20" :key="i" 
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[
          i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-blue-400'
        ]"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.4,
          animationDelay: `${Math.random() * 2}s`
        }"
      ></div>
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl text-center">
        <!-- Badge -->
        <div class="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
          <span class="text-sm font-medium text-amber-300">Case Studies</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-white md:text-7xl">
          Proven <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-blue-400 bg-clip-text text-transparent animate-gradient">Results</span>
        </h1>
        
        <p class="hero-title mx-auto max-w-3xl text-xl text-slate-400 leading-relaxed">
          Explore our <span class="text-cyan-400">AI-designed therapeutics</span> with interactive 3D molecular viewers. 
          Rotate, zoom, and examine the structures that are advancing medicine.
        </p>
        
        <!-- Interactive hint -->
        <div class="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Click and drag on molecules to rotate • Scroll to zoom</span>
        </div>
      </div>
    </section>

    <!-- Case Studies with 3D Viewers -->
    <section class="relative z-10 px-6 py-12">
      <div class="mx-auto max-w-7xl">
        <div class="space-y-24">
          <div 
            v-for="(study, index) in caseStudies" 
            :key="study.id"
            class="case-card group"
          >
            <div 
              class="relative rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-1 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-slate-700/50"
              :class="[
                study.color === 'cyan' ? 'hover:shadow-2xl hover:shadow-cyan-500/20' : '',
                study.color === 'purple' ? 'hover:shadow-2xl hover:shadow-purple-500/20' : '',
                study.color === 'pink' ? 'hover:shadow-2xl hover:shadow-blue-500/20' : '',
                study.color === 'emerald' ? 'hover:shadow-2xl hover:shadow-emerald-500/20' : '',
                study.color === 'amber' ? 'hover:shadow-2xl hover:shadow-amber-500/20' : '',
              ]"
            >
              <!-- Glow effect -->
              <div 
                class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                :class="[
                  study.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent' : '',
                  study.color === 'purple' ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-transparent' : '',
                  study.color === 'pink' ? 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent' : '',
                  study.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent' : '',
                  study.color === 'amber' ? 'bg-gradient-to-br from-amber-500/10 via-transparent to-transparent' : '',
                ]"
              ></div>
              
              <div class="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                <!-- Content Side -->
                <div :class="index % 2 === 1 ? 'lg:order-2' : ''">
                  <!-- Category Badge -->
                  <div class="mb-4">
                    <span 
                      class="rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase ring-1"
                      :class="[
                        study.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' : '',
                        study.color === 'purple' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/30' : '',
                        study.color === 'pink' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/30' : '',
                        study.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' : '',
                        study.color === 'amber' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' : '',
                      ]"
                    >
                      {{ study.category }}
                    </span>
                  </div>
                  
                  <h2 class="mb-2 text-3xl font-bold text-white lg:text-4xl">{{ study.title }}</h2>
                  <p class="mb-4 text-slate-500 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ study.partner }}
                  </p>
                  <p class="mb-6 text-lg text-slate-400 leading-relaxed">{{ study.description }}</p>
                  
                  <!-- Sequence Display (hide for drug table) -->
                  <div v-if="study.moleculeType !== 'drugTable' && study.moleculeType !== 'mrnaVisualization'" class="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">{{ study.moleculeType === 'smallMolecule' ? 'SMILES Structure' : 'Peptide Sequence' }}</p>
                    <p class="font-mono text-sm tracking-wider break-all"
                      :class="[
                        study.color === 'cyan' ? 'text-cyan-400' : '',
                        study.color === 'purple' ? 'text-purple-400' : '',
                        study.color === 'pink' ? 'text-blue-400' : '',
                        study.color === 'emerald' ? 'text-emerald-400' : '',
                        study.color === 'amber' ? 'text-amber-400' : '',
                      ]"
                    >
                      {{ study.sequence }}
                    </p>
                  </div>
                  
                  <!-- Results Grid -->
                  <div class="grid grid-cols-3 gap-4">
                    <div 
                      v-for="result in study.results" 
                      :key="result.label" 
                      class="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 transition-all duration-300 hover:scale-105"
                      :class="[
                        study.color === 'cyan' ? 'hover:border-cyan-500/30' : '',
                        study.color === 'purple' ? 'hover:border-purple-500/30' : '',
                        study.color === 'pink' ? 'hover:border-blue-500/30' : '',
                        study.color === 'emerald' ? 'hover:border-emerald-500/30' : '',
                        study.color === 'amber' ? 'hover:border-amber-500/30' : '',
                      ]"
                    >
                      <div 
                        class="text-2xl lg:text-3xl font-bold mb-1"
                        :class="[
                          study.color === 'cyan' ? 'text-cyan-400' : '',
                          study.color === 'purple' ? 'text-purple-400' : '',
                          study.color === 'pink' ? 'text-blue-400' : '',
                          study.color === 'emerald' ? 'text-emerald-400' : '',
                          study.color === 'amber' ? 'text-amber-400' : '',
                        ]"
                      >
                        {{ result.metric }}
                      </div>
                      <div class="text-xs text-slate-500">{{ result.label }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 3D Viewer Side OR Drug Table -->
                <div :class="index % 2 === 1 ? 'lg:order-1' : ''">
                  <div class="relative">
                    <!-- Drug Repurposing Table (for drugTable type) -->
                    <div v-if="study.moleculeType === 'drugTable'" class="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-4 shadow-lg shadow-emerald-500/10">
                      <!-- Target Selector Tabs -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <button 
                          v-for="target in Object.keys(drugRepurposingData)" 
                          :key="target"
                          @click="selectedTarget = target"
                          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          :class="selectedTarget === target 
                            ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' 
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'"
                        >
                          {{ target }}
                        </button>
                      </div>
                      
                      <!-- Table -->
                      <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="border-b border-slate-700/50">
                              <th class="text-left py-2 px-2 text-slate-400 font-medium text-xs">Drug Name</th>
                              <th class="text-center py-2 px-2 text-slate-400 font-medium text-xs">pIC50</th>
                              <th class="text-center py-2 px-2 text-slate-400 font-medium text-xs">FDA Rank</th>
                              <th class="text-center py-2 px-2 text-slate-400 font-medium text-xs">Antiviral Rank</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr 
                              v-for="(drug, idx) in drugRepurposingData[selectedTarget as keyof typeof drugRepurposingData]" 
                              :key="drug.drug"
                              class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                            >
                              <td class="py-2 px-2 text-white font-medium text-xs">
                                <span class="inline-flex items-center gap-2">
                                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">{{ idx + 1 }}</span>
                                  {{ drug.drug }}
                                </span>
                              </td>
                              <td class="py-2 px-2 text-center">
                                <span class="text-emerald-400 font-mono font-bold">{{ drug.pIC50.toFixed(2) }}</span>
                              </td>
                              <td class="py-2 px-2 text-center text-slate-300">#{{ drug.rankFDA }}</td>
                              <td class="py-2 px-2 text-center">
                                <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">#{{ drug.rankAntiviral }}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <!-- Table Footer -->
                      <div class="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <p class="text-xs text-slate-500">Top 5 candidates for {{ selectedTarget }} target</p>
                        <div class="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300">
                          <span class="inline-block w-2 h-2 rounded-full animate-pulse mr-2 bg-emerald-400"></span>
                          AI Predictions
                        </div>
                      </div>
                    </div>
                    
                    <!-- mRNA Benchmark Results (for mrnaVisualization type) -->
                    <div 
                      v-else-if="study.moleculeType === 'mrnaVisualization'"
                      class="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/80 p-4 shadow-lg shadow-cyan-500/10"
                    >
                      <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        Benchmark Results
                      </h4>
                      
                      <!-- Results Table -->
                      <div class="overflow-x-auto">
                        <table class="w-full text-xs">
                          <thead>
                            <tr class="border-b border-slate-700/50">
                              <th class="text-left py-2 px-1 text-slate-400 font-medium">Model</th>
                              <th class="text-center py-2 px-1 text-slate-400 font-medium">E.coli</th>
                              <th class="text-center py-2 px-1 text-slate-400 font-medium">MLOS</th>
                              <th class="text-center py-2 px-1 text-slate-400 font-medium">iCodon</th>
                              <th class="text-center py-2 px-1 text-slate-400 font-medium">Tc-Ribo</th>
                              <th class="text-center py-2 px-1 text-slate-400 font-medium">mRFP</th>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- Nucleotide-Based -->
                            <tr class="border-b border-slate-800/30">
                              <td colspan="6" class="py-1.5 px-1 text-slate-500 text-xs italic">Nucleotide-Based</td>
                            </tr>
                            <tr class="border-b border-slate-800/30 hover:bg-slate-800/20">
                              <td class="py-1.5 px-1 text-slate-300">RNA-FM</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.43</td>
                              <td class="py-1.5 px-1 text-center text-slate-500">-</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.34</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.58</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.80</td>
                            </tr>
                            <tr class="border-b border-slate-800/30 hover:bg-slate-800/20">
                              <td class="py-1.5 px-1 text-slate-300">Aido mRNA</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.576</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.504</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.472</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.492</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.683</td>
                            </tr>
                            <tr class="border-b border-slate-800/30 hover:bg-slate-800/20">
                              <td class="py-1.5 px-1 text-slate-300">mRNA-FM</td>
                              <td class="py-1.5 px-1 text-center text-slate-500">-</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.509</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.458</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.690</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.564</td>
                            </tr>
                            <!-- Codon-Based -->
                            <tr class="border-b border-slate-800/30">
                              <td colspan="6" class="py-1.5 px-1 text-slate-500 text-xs italic">Codon-Based</td>
                            </tr>
                            <tr class="border-b border-slate-800/30 hover:bg-slate-800/20">
                              <td class="py-1.5 px-1 text-slate-300">CodonBert</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.57</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.543</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.350</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.502</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.832</td>
                            </tr>
                            <tr class="border-b border-slate-800/30 hover:bg-slate-800/20">
                              <td class="py-1.5 px-1 text-slate-300">HELM (MLM)</td>
                              <td class="py-1.5 px-1 text-center text-slate-500">-</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.701</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.525</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.626</td>
                              <td class="py-1.5 px-1 text-center text-slate-400">0.822</td>
                            </tr>
                            <!-- Equi-mRNA (Ours) -->
                            <tr class="border-b border-cyan-500/30 bg-cyan-500/5">
                              <td class="py-1.5 px-1 text-cyan-300 font-semibold">Equi-mRNA (5M)</td>
                              <td class="py-1.5 px-1 text-center text-slate-300">0.581</td>
                              <td class="py-1.5 px-1 text-center text-slate-300">0.705</td>
                              <td class="py-1.5 px-1 text-center text-slate-300">0.519</td>
                              <td class="py-1.5 px-1 text-center font-bold text-cyan-400">0.764</td>
                              <td class="py-1.5 px-1 text-center text-slate-300">0.853</td>
                            </tr>
                            <tr class="bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                              <td class="py-1.5 px-1 text-cyan-300 font-bold">Equi-mRNA (15M)</td>
                              <td class="py-1.5 px-1 text-center font-bold text-cyan-400">0.613</td>
                              <td class="py-1.5 px-1 text-center font-bold text-cyan-400">0.710</td>
                              <td class="py-1.5 px-1 text-center font-bold text-cyan-400">0.537</td>
                              <td class="py-1.5 px-1 text-center text-slate-300">0.737</td>
                              <td class="py-1.5 px-1 text-center font-bold text-cyan-400">0.855</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <!-- Table Footer -->
                      <div class="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <p class="text-xs text-slate-500">Bold = Best performance on dataset</p>
                        <a 
                          href="https://arxiv.org/abs/2508.15103" 
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          NeurIPS 2025 Paper
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <!-- Viewer Container (for non-drugTable and non-mrnaVisualization types) -->
                    <div 
                      v-else
                      class="relative aspect-square rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/80"
                      :class="[
                        study.color === 'cyan' ? 'shadow-lg shadow-cyan-500/10' : '',
                        study.color === 'purple' ? 'shadow-lg shadow-purple-500/10' : '',
                        study.color === 'pink' ? 'shadow-lg shadow-blue-500/10' : '',
                        study.color === 'amber' ? 'shadow-lg shadow-amber-500/10' : '',
                      ]"
                    >
                      <!-- Loading State -->
                      <div 
                        v-if="isViewerLoading[index]"
                        class="absolute inset-0 flex items-center justify-center bg-slate-900"
                      >
                        <div class="text-center">
                          <div 
                            class="w-12 h-12 mx-auto mb-4 border-4 border-slate-700 rounded-full animate-spin"
                            :class="[
                              study.color === 'cyan' ? 'border-t-cyan-500' : '',
                              study.color === 'purple' ? 'border-t-purple-500' : '',
                              study.color === 'pink' ? 'border-t-blue-500' : '',
                              study.color === 'amber' ? 'border-t-amber-500' : '',
                            ]"
                          ></div>
                          <p class="text-sm text-slate-500">Loading 3D structure...</p>
                        </div>
                      </div>
                      
                      <!-- 3Dmol Viewer -->
                      <div 
                        :ref="(el) => viewerRefs[index] = el as HTMLElement"
                        class="absolute inset-0 w-full h-full min-h-[350px] lg:min-h-[450px]"
                        style="z-index: 1;"
                        @mouseenter="stopRotation(index)"
                        @mouseleave="startRotation(index)"
                      ></div>
                      
                      <!-- Viewer Controls -->
                      <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between" style="z-index: 100;">
                        <div class="flex items-center gap-2">
                          <button 
                            @click="resetView(index)"
                            @mousedown.stop.prevent
                            type="button"
                            class="relative px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:bg-slate-600 transition-colors backdrop-blur-sm cursor-pointer select-none"
                            style="z-index: 9999; pointer-events: auto !important; position: relative;"
                          >
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                          </button>
                        </div>
                        
                        <div 
                          class="px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm"
                          :class="[
                            study.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-300' : '',
                            study.color === 'purple' ? 'bg-purple-500/20 text-purple-300' : '',
                            study.color === 'pink' ? 'bg-blue-500/20 text-blue-300' : '',
                            study.color === 'amber' ? 'bg-amber-500/20 text-amber-300' : '',
                          ]"
                        >
                          <span class="inline-block w-2 h-2 rounded-full animate-pulse mr-2"
                            :class="[
                              study.color === 'cyan' ? 'bg-cyan-400' : '',
                              study.color === 'purple' ? 'bg-purple-400' : '',
                              study.color === 'pink' ? 'bg-blue-400' : '',
                              study.color === 'amber' ? 'bg-amber-400' : '',
                            ]"
                          ></span>
                          Interactive 3D
                        </div>
                      </div>
                    </div>
                    
                    <!-- Decorative elements -->
                    <div 
                      class="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30"
                      :class="[
                        study.color === 'cyan' ? 'bg-cyan-500' : '',
                        study.color === 'purple' ? 'bg-purple-500' : '',
                        study.color === 'pink' ? 'bg-blue-500' : '',
                        study.color === 'emerald' ? 'bg-emerald-500' : '',
                        study.color === 'amber' ? 'bg-amber-500' : '',
                      ]"
                    ></div>
                    <div 
                      class="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-3xl opacity-20"
                      :class="[
                        study.color === 'cyan' ? 'bg-blue-500' : '',
                        study.color === 'purple' ? 'bg-blue-500' : '',
                        study.color === 'pink' ? 'bg-orange-500' : '',
                        study.color === 'emerald' ? 'bg-teal-500' : '',
                        study.color === 'amber' ? 'bg-orange-500' : '',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials - Commented out for now -->
    <!--
    <section class="relative z-10 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent px-6 py-32">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            Testimonials
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl">What Partners Say</h2>
        </div>
        
        <div class="grid gap-8 md:grid-cols-2">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.author"
            class="case-card group relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/5"
          >
            <div class="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <p class="mb-6 text-lg text-slate-300 leading-relaxed italic pl-6">
              "{{ testimonial.quote }}"
            </p>
            
            <div class="flex items-center gap-4">
              <img 
                :src="testimonial.image" 
                :alt="testimonial.author"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div>
                <p class="font-bold text-white">{{ testimonial.author }}</p>
                <p class="text-sm text-slate-500">{{ testimonial.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    -->

    <!-- CTA Section -->
    <section class="relative z-10 px-6 py-32">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 p-12 text-center overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Success Story</span>?
            </h2>
            <p class="mb-8 text-lg text-slate-400 max-w-2xl mx-auto">
              Join leading pharmaceutical and biotech companies using DeepBio Scientific to accelerate therapeutic discovery with AI-powered molecular design.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link 
                to="/contact"
                class="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
              >
                <span class="relative z-10">Start a Partnership</span>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.case-card {
  opacity: 1;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 3Dmol canvas styling */
:deep(.mol-container canvas) {
  border-radius: 1rem;
}
</style>
